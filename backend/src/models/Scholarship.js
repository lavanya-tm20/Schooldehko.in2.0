const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scholarship = sequelize.define('Scholarship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  scholarship_type: {
    type: DataTypes.ENUM('merit', 'need_based', 'sports', 'arts', 'minority', 'government', 'private'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  amount_type: {
    type: DataTypes.ENUM('one_time', 'annual', 'monthly', 'percentage'),
    allowNull: false
  },
  eligibility_criteria: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      min_age: null,
      max_age: null,
      classes: [],
      boards: [],
      min_percentage: null,
      family_income_limit: null,
      category: [],
      gender: null,
      state: null,
      other_criteria: []
    }
  },
  application_start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  application_end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  required_documents: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  application_process: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  contact_details: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      email: null,
      phone: null,
      website: null,
      address: null
    }
  },
  total_scholarships: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_renewable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  renewal_criteria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  application_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'scholarships',
  indexes: [
    {
      fields: ['scholarship_type']
    },
    {
      fields: ['application_start_date', 'application_end_date']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['featured']
    }
  ]
});

// Instance methods
Scholarship.prototype.isApplicationOpen = function() {
  const now = new Date();
  return now >= this.application_start_date && now <= this.application_end_date;
};

Scholarship.prototype.checkEligibility = function(userProfile) {
  const criteria = this.eligibility_criteria;
  const eligible = {
    age: true,
    class: true,
    board: true,
    percentage: true,
    income: true,
    category: true,
    gender: true,
    state: true
  };

  // Age check
  if (criteria.min_age || criteria.max_age) {
    const age = userProfile.age;
    if (criteria.min_age && age < criteria.min_age) eligible.age = false;
    if (criteria.max_age && age > criteria.max_age) eligible.age = false;
  }

  // Class check
  if (criteria.classes && criteria.classes.length > 0) {
    eligible.class = criteria.classes.includes(userProfile.class);
  }

  // Board check
  if (criteria.boards && criteria.boards.length > 0) {
    eligible.board = criteria.boards.includes(userProfile.board);
  }

  // Percentage check
  if (criteria.min_percentage) {
    eligible.percentage = userProfile.percentage >= criteria.min_percentage;
  }

  // Family income check
  if (criteria.family_income_limit) {
    eligible.income = userProfile.family_income <= criteria.family_income_limit;
  }

  // Category check
  if (criteria.category && criteria.category.length > 0) {
    eligible.category = criteria.category.includes(userProfile.category);
  }

  // Gender check
  if (criteria.gender) {
    eligible.gender = criteria.gender === userProfile.gender;
  }

  // State check
  if (criteria.state) {
    eligible.state = criteria.state === userProfile.state;
  }

  return {
    eligible: Object.values(eligible).every(Boolean),
    details: eligible
  };
};

module.exports = Scholarship;
