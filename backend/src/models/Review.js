const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schools',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pros: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cons: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_ratings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      academics: 0,
      infrastructure: 0,
      teachers: 0,
      extracurricular: 0,
      safety: 0
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'reviews',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['school_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Review;
