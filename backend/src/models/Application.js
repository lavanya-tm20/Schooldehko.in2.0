const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
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
  student_dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  student_gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  class_applying_for: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  academic_year: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  previous_school: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  father_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  mother_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  guardian_phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  guardian_email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  documents_submitted: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      birth_certificate: false,
      previous_marksheet: false,
      transfer_certificate: false,
      photos: false,
      address_proof: false,
      income_certificate: false
    }
  },
  application_status: {
    type: DataTypes.ENUM(
      'draft',
      'submitted',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'accepted',
      'rejected',
      'waitlisted',
      'admitted'
    ),
    defaultValue: 'draft'
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  entrance_exam_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  interview_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  total_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  admission_fee_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'applications',
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
    }
  ],
  hooks: {
    beforeCreate: (application) => {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      application.application_number = `SDA${timestamp}${random}`;
    }
  }
});

module.exports = Application;
