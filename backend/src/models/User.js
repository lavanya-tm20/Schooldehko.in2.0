const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      is: /^[+]?[1-9][\d\s\-\(\)]{7,15}$/
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('parent', 'student', 'school_admin', 'super_admin', 'alumni'),
    defaultValue: 'parent'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  preferred_language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  profile_completion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['city', 'state']
    },
    {
      fields: ['is_active']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const isAlreadyHashed = typeof user.password === 'string' && user.password.startsWith('$2');
        if (!isAlreadyHashed) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const isAlreadyHashed = typeof user.password === 'string' && user.password.startsWith('$2');
        if (!isAlreadyHashed) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

User.prototype.updateProfileCompletion = function() {
  let completion = 0;
  const fields = [
    'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
    'gender', 'address', 'city', 'state', 'pincode', 'avatar'
  ];
  
  fields.forEach(field => {
    if (this[field]) completion += 9; // 100/11 fields ≈ 9 points each
  });
  
  this.profile_completion = Math.min(completion, 100);
  return this.save();
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email, is_active: true } });
};

User.findActiveUsers = function(options = {}) {
  return this.findAll({
    where: { is_active: true },
    ...options
  });
};

module.exports = User;
