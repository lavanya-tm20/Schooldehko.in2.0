const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: true },
  role: { type: DataTypes.ENUM('user', 'assistant', 'system'), defaultValue: 'user' },
  message: { type: DataTypes.TEXT, allowNull: false },
  metadata: { type: DataTypes.JSON, allowNull: true, defaultValue: {} }
}, {
  tableName: 'chat_messages',
  indexes: [ { fields: ['user_id'] } ]
});

module.exports = ChatMessage;
