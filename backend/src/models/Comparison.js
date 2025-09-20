const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comparison = sequelize.define('Comparison', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  school_id: { type: DataTypes.UUID, allowNull: false },
  list_id: { type: DataTypes.STRING(50), allowNull: true },
  attributes_snapshot: { type: DataTypes.JSON, allowNull: true, defaultValue: {} }
}, {
  tableName: 'comparisons',
  indexes: [ { fields: ['user_id'] }, { fields: ['school_id'] }, { fields: ['list_id'] } ],
  timestamps: true
});

module.exports = Comparison;
