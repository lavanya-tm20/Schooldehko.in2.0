const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alumni = sequelize.define('Alumni', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  school_id: { type: DataTypes.UUID, allowNull: false },
  passing_year: { type: DataTypes.INTEGER, allowNull: false },
  current_education: { type: DataTypes.STRING(200), allowNull: true },
  current_company: { type: DataTypes.STRING(200), allowNull: true },
  designation: { type: DataTypes.STRING(200), allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  achievements: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  links: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'alumni',
  indexes: [ { fields: ['school_id'] }, { fields: ['user_id'] }, { fields: ['passing_year'] } ]
});

module.exports = Alumni;
