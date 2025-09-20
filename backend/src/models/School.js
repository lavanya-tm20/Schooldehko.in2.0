const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  school_type: {
    type: DataTypes.ENUM('day_school', 'boarding_school', 'play_school', 'pu_college', 'international'),
    allowNull: false
  },
  board: {
    type: DataTypes.ENUM('cbse', 'icse', 'ib', 'igcse', 'state_board', 'other'),
    allowNull: false
  },
  medium: {
    type: DataTypes.JSON, // Array of languages: ['english', 'hindi', 'regional']
    allowNull: false,
    defaultValue: ['english']
  },
  classes_offered: {
    type: DataTypes.JSON, // Array: ['nursery', 'lkg', 'ukg', '1', '2', ..., '12']
    allowNull: false,
    defaultValue: []
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  established_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  principal_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  total_students: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  total_teachers: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  student_teacher_ratio: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  campus_area: {
    type: DataTypes.DECIMAL(8, 2), // in acres
    allowNull: true
  },
  fees: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      admission_fee: 0,
      annual_fee: 0,
      monthly_fee: 0,
      transport_fee: 0,
      other_fees: {}
    }
  },
  facilities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  extracurricular: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  admission_process: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admission_criteria: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  admission_dates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      application_start: null,
      application_end: null,
      entrance_exam: null,
      interview_dates: null,
      result_announcement: null
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  brochure_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  seo_meta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      title: '',
      description: '',
      keywords: []
    }
  }
}, {
  tableName: 'schools',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['city', 'state']
    },
    {
      fields: ['school_type']
    },
    {
      fields: ['board']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['is_active', 'is_verified']
    },
    {
      fields: ['latitude', 'longitude']
    }
  ],
  hooks: {
    beforeValidate: (school) => {
      if (!school.slug && school.name) {
        school.slug = school.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    },
    beforeSave: (school) => {
      school.last_updated = new Date();
      // If name changed and slug not manually set, regenerate
      if (school.changed('name') && !school.changed('slug')) {
        school.slug = school.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

// Instance methods
School.prototype.updateRating = async function() {
  const { Review } = require('./index');
  const reviews = await Review.findAll({
    where: { school_id: this.id },
    attributes: ['rating']
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / reviews.length).toFixed(2);
    this.total_reviews = reviews.length;
  } else {
    this.rating = 0;
    this.total_reviews = 0;
  }

  return this.save();
};

School.prototype.getDistance = function(lat, lng) {
  if (!this.latitude || !this.longitude) return null;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat - this.latitude) * Math.PI / 180;
  const dLng = (lng - this.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Class methods
School.findByCity = function(city, options = {}) {
  return this.findAll({
    where: { 
      city: city,
      is_active: true,
      is_verified: true
    },
    ...options
  });
};

School.findByType = function(schoolType, options = {}) {
  return this.findAll({
    where: { 
      school_type: schoolType,
      is_active: true,
      is_verified: true
    },
    ...options
  });
};

School.searchByName = function(query, options = {}) {
  const { Op } = require('sequelize');
  return this.findAll({
    where: {
      name: {
        [Op.like]: `%${query}%`
      },
      is_active: true,
      is_verified: true
    },
    ...options
  });
};

module.exports = School;
