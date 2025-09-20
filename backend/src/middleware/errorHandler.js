const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error handler caught:', { message: err.message, stack: err.stack });

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
};
