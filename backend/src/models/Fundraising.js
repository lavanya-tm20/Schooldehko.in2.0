const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fundraising = sequelize.define('Fundraising', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  school_id: { type: DataTypes.UUID, allowNull: false },
  created_by: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  goal_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  raised_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  deadline: { type: DataTypes.DATE, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'fundraising', indexes: [ { fields: ['school_id'] }, { fields: ['created_by'] } ] });

module.exports = Fundraising;
