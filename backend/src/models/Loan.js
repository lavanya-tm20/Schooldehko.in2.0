const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loan = sequelize.define('Loan', {
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
  application_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  student_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  student_class: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  student_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2,
      max: 25
    }
  },
  parent_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  parent_occupation: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  annual_income: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  loan_amount_requested: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 1000
    }
  },
  loan_purpose: {
    type: DataTypes.ENUM(
      'admission_fee',
      'annual_fee',
      'monthly_fee',
      'transport_fee',
      'books_uniform',
      'infrastructure',
      'complete_education',
      'other'
    ),
    allowNull: false
  },
  loan_tenure_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 6,
      max: 120 // 10 years max
    }
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true // Will be calculated based on eligibility
  },
  emi_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true // Will be calculated
  },
  employment_type: {
    type: DataTypes.ENUM('salaried', 'self_employed', 'business', 'professional', 'other'),
    allowNull: false
  },
  employer_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  work_experience_years: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 50
    }
  },
  monthly_income: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  existing_loans: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  credit_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 300,
      max: 900
    }
  },
  guarantor_details: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  documents_submitted: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      identity_proof: false,
      address_proof: false,
      income_proof: false,
      bank_statements: false,
      school_admission_letter: false,
      fee_structure: false,
      guarantor_documents: false
    }
  },
  application_status: {
    type: DataTypes.ENUM(
      'draft',
      'submitted',
      'under_review',
      'documents_required',
      'approved',
      'rejected',
      'disbursed',
      'closed'
    ),
    defaultValue: 'draft'
  },
  eligibility_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approval_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disbursement_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loan_start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loan_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  bank_partner: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  loan_account_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  repayment_schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  total_amount_paid: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  outstanding_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  next_emi_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payment_history: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assigned_officer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  }
}, {
  tableName: 'loans',
  indexes: [
    {
      unique: true,
      fields: ['application_number']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['school_id']
    },
    {
      fields: ['application_status']
    },
    {
      fields: ['loan_purpose']
    },
    {
      fields: ['approval_date']
    },
    {
      fields: ['next_emi_date']
    }
  ],
  hooks: {
    beforeValidate: (loan) => {
      if (!loan.application_number) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        loan.application_number = `SDL${timestamp}${random}`;
      }
    },
    beforeSave: (loan) => {
      // Calculate or recalc EMI when relevant data present/changed
      const shouldCalc = (
        loan.interest_rate && loan.loan_amount_requested && loan.loan_tenure_months &&
        (
          loan.isNewRecord ||
          loan.changed('interest_rate') || loan.changed('loan_amount_requested') || loan.changed('loan_tenure_months')
        )
      );
      if (shouldCalc) {
        const monthlyRate = loan.interest_rate / 100 / 12;
        const emi = (loan.loan_amount_requested * monthlyRate * Math.pow(1 + monthlyRate, loan.loan_tenure_months)) /
                    (Math.pow(1 + monthlyRate, loan.loan_tenure_months) - 1);
        loan.emi_amount = Math.round(emi * 100) / 100;
      }
    }
  }
});

// Instance methods
Loan.prototype.calculateEligibilityScore = function() {
  let score = 0;
  
  // Income criteria (30 points)
  const incomeToLoanRatio = this.annual_income / this.loan_amount_requested;
  if (incomeToLoanRatio >= 3) score += 30;
  else if (incomeToLoanRatio >= 2) score += 20;
  else if (incomeToLoanRatio >= 1.5) score += 10;
  
  // Credit score (25 points)
  if (this.credit_score >= 750) score += 25;
  else if (this.credit_score >= 700) score += 20;
  else if (this.credit_score >= 650) score += 15;
  else if (this.credit_score >= 600) score += 10;
  
  // Work experience (20 points)
  if (this.work_experience_years >= 5) score += 20;
  else if (this.work_experience_years >= 3) score += 15;
  else if (this.work_experience_years >= 2) score += 10;
  else if (this.work_experience_years >= 1) score += 5;
  
  // Employment type (15 points)
  if (this.employment_type === 'salaried') score += 15;
  else if (this.employment_type === 'professional') score += 12;
  else if (this.employment_type === 'business') score += 10;
  else if (this.employment_type === 'self_employed') score += 8;
  
  // Documents completion (10 points)
  const docsSubmitted = Object.values(this.documents_submitted || {});
  const completionRate = docsSubmitted.filter(Boolean).length / docsSubmitted.length;
  score += Math.round(completionRate * 10);
  
  this.eligibility_score = Math.min(score, 100);
  return this.eligibility_score;
};

Loan.prototype.generateRepaymentSchedule = function() {
  if (!this.emi_amount || !this.loan_start_date || !this.loan_tenure_months) {
    return [];
  }
  
  const schedule = [];
  let remainingPrincipal = parseFloat(this.loan_amount_requested);
  const monthlyRate = this.interest_rate / 100 / 12;
  const emiAmount = parseFloat(this.emi_amount);
  
  for (let i = 1; i <= this.loan_tenure_months; i++) {
    const interestAmount = remainingPrincipal * monthlyRate;
    const principalAmount = emiAmount - interestAmount;
    remainingPrincipal -= principalAmount;
    
    const dueDate = new Date(this.loan_start_date);
    dueDate.setMonth(dueDate.getMonth() + i);
    
    schedule.push({
      emi_number: i,
      due_date: dueDate.toISOString().split('T')[0],
      emi_amount: Math.round(emiAmount * 100) / 100,
      principal_amount: Math.round(principalAmount * 100) / 100,
      interest_amount: Math.round(interestAmount * 100) / 100,
      outstanding_balance: Math.round(Math.max(remainingPrincipal, 0) * 100) / 100,
      status: 'pending'
    });
  }
  
  this.repayment_schedule = schedule;
  this.outstanding_amount = this.loan_amount_requested;
  return schedule;
};

// Class methods
Loan.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: { application_status: status },
    ...options
  });
};

Loan.findByUser = function(userId, options = {}) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    ...options
  });
};

Loan.findPendingEMIs = function(options = {}) {
  const { Op } = require('sequelize');
  return this.findAll({
    where: {
      application_status: 'disbursed',
      next_emi_date: {
        [Op.lte]: new Date()
      }
    },
    ...options
  });
};

module.exports = Loan;
