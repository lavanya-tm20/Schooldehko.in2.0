const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Policy = sequelize.define('Policy', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  school_id: { type: DataTypes.UUID, allowNull: false },
  type: { 
    type: DataTypes.ENUM('safety', 'code_of_conduct', 'privacy', 'uniform'),
    allowNull: false
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  effective_date: { type: DataTypes.DATE, allowNull: true },
  attachments: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'policies', indexes: [ { fields: ['school_id'] }, { fields: ['type'] }, { fields: ['is_active'] } ]});

module.exports = Policy;
