const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const School = require('./School');
const Review = require('./Review');
const Application = require('./Application');
const Loan = require('./Loan');
const Scholarship = require('./Scholarship');
const Alumni = require('./Alumni');
const Fundraising = require('./Fundraising');
const Policy = require('./Policy');
const Comparison = require('./Comparison');
const ChatMessage = require('./ChatMessage');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
  User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
  User.hasMany(Loan, { foreignKey: 'user_id', as: 'loans' });
  User.hasMany(Alumni, { foreignKey: 'user_id', as: 'alumniProfile' });
  User.hasMany(Fundraising, { foreignKey: 'created_by', as: 'fundraisingCampaigns' });
  User.hasMany(Comparison, { foreignKey: 'user_id', as: 'comparisons' });
  User.hasMany(ChatMessage, { foreignKey: 'user_id', as: 'chatMessages' });

  // School associations
  School.hasMany(Review, { foreignKey: 'school_id', as: 'reviews' });
  School.hasMany(Application, { foreignKey: 'school_id', as: 'applications' });
  School.hasMany(Alumni, { foreignKey: 'school_id', as: 'alumni' });
  School.hasMany(Policy, { foreignKey: 'school_id', as: 'policies' });
  School.belongsToMany(User, { 
    through: Comparison, 
    foreignKey: 'school_id',
    otherKey: 'user_id',
    as: 'comparedByUsers'
  });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Review.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Application associations
  Application.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Application.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Loan associations
  Loan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Loan.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Scholarship associations
  Scholarship.belongsToMany(User, { 
    through: 'user_scholarships',
    foreignKey: 'scholarship_id',
    otherKey: 'user_id',
    as: 'applicants'
  });

  // Alumni associations
  Alumni.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Alumni.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Fundraising associations
  Fundraising.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Fundraising.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Policy associations
  Policy.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // Comparison associations
  Comparison.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Comparison.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

  // ChatMessage associations
  ChatMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Initialize associations
defineAssociations();

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  School,
  Review,
  Application,
  Loan,
  Scholarship,
  Alumni,
  Fundraising,
  Policy,
  Comparison,
  ChatMessage
};
