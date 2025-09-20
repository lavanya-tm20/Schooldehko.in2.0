const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const db = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const seedOnceIfEmpty = require('./utils/seedOnceIfEmpty');

// Import routes
const authRoutes = require('./routes/auth');
const schoolRoutes = require('./routes/schools');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const scholarshipRoutes = require('./routes/scholarships');
const alumniRoutes = require('./routes/alumni');
const fundraisingRoutes = require('./routes/fundraising');
const chatbotRoutes = require('./routes/chatbot');
const comparisonRoutes = require('./routes/comparison');
const policiesRoutes = require('./routes/policies');

const app = express();
const server = createServer(app);

// Normalize CORS origins from env: allow comma-separated list, strip stray quotes
const rawCorsEnv = process.env.CORS_ORIGIN || 'http://localhost:3000';
const ALLOWED_ORIGINS = rawCorsEnv
  .split(',')
  .map(s => (s || '').trim())
  .map(s => s.replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
  .filter(Boolean);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Health check endpoint BEFORE CORS to avoid any header issues
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow tools like curl/postman
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));

// Preflight for all routes
app.options('*', cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// (Note) /health is already registered above before CORS

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/fundraising', fundraisingRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/policies', policiesRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their personal room`);
  });

  // Handle chatbot messages
  socket.on('chatbot-message', async (data) => {
    try {
      // Process chatbot message and emit response
      const response = await processChatbotMessage(data.message, data.userId);
      socket.emit('chatbot-response', response);
    } catch (error) {
      logger.error('Chatbot error:', error);
      socket.emit('chatbot-error', { message: 'Sorry, I encountered an error. Please try again.' });
    }
  });

  // Handle real-time notifications
  socket.on('subscribe-notifications', (userId) => {
    socket.join(`notifications-${userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Test database connection
    await db.authenticate();
    logger.info('Database connection established successfully');

    // Auto-seed in ephemeral environments (e.g., Render free tier using /tmp) or when explicitly enabled
    const shouldSeed = String(process.env.SEED_ON_START || '').toLowerCase() === 'true'
      || String(process.env.SQLITE_STORAGE || '').includes('/tmp');
    if (shouldSeed) {
      try {
        // Ensure tables exist (safe for SQLite /tmp); alter keeps data if present
        await db.sync({ alter: true });
        logger.info('Database sync (alter) completed for ephemeral environment');
        const seeded = await seedOnceIfEmpty();
        if (seeded) {
          logger.info('Auto-seed completed (ephemeral or SEED_ON_START)');
        } else {
          logger.info('Auto-seed skipped: data already present');
        }
      } catch (se) {
        logger.error('Auto-seed failed:', se);
      }
    }

    // Optional model sync on start (disabled by default to avoid SQLite lock/alter issues)
    if (String(process.env.DB_SYNC_ON_START).toLowerCase() === 'true') {
      const alter = String(process.env.DB_SYNC_ALTER || 'false').toLowerCase() === 'true';
      await db.sync(alter ? { alter: true } : {});
      logger.info(`Database models synchronized${alter ? ' with ALTER' : ''}`);
    }

    // Start server
    server.listen(PORT, HOST, () => {
      logger.info(`🚀 SchoolDekho.in Backend Server running on http://${HOST}:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 CORS Origin(s): ${ALLOWED_ORIGINS.join(', ')}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Placeholder function for chatbot processing
async function processChatbotMessage(message, userId) {
  // This will be implemented in the chatbot service
  return {
    message: "Hello! I'm your SchoolDekho assistant. How can I help you find the perfect school today?",
    timestamp: new Date().toISOString()
  };
}

startServer();

module.exports = app;
