const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

const DIALECT = process.env.DB_DIALECT || 'mysql';

let sequelize;
if (DIALECT === 'sqlite') {
  const storage = process.env.SQLITE_STORAGE || path.join(__dirname, '../../data/dev.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: (msg) => logger.debug(msg),
    define: { timestamps: true, underscored: true, freezeTableName: true }
  });
  logger.info(`Using SQLite storage at ${storage}`);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'schooldekho_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: (msg) => logger.debug(msg),
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: true, freezeTableName: true },
      timezone: '+05:30'
    }
  );
}

// Test connection
sequelize.authenticate()
  .then(() => { logger.info('✅ Database connection established successfully'); })
  .catch(err => { logger.error('❌ Unable to connect to the database:', err); });

module.exports = sequelize;
