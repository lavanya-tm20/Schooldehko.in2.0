# SchoolDekho.in - Enhanced School Discovery Platform

## Overview
SchoolDekho.in is an enhanced school discovery platform inspired by EduStoke.com, featuring additional capabilities for student loans, school comparisons, AI assistance, and community features.

## 🚀 Features

### Core Features (EduStoke Clone)
- **School Search & Discovery**: Search from 25,000+ schools across India
- **Multi-category Support**: Day Schools, Play Schools, Boarding Schools, PU & Junior Colleges
- **Location-based Search**: Find schools in major cities
- **Detailed School Information**: Fees, Reviews, Facilities, Admission details
- **Personalized Counseling**: Expert guidance for school selection

### New Enhanced Features
1. **🏦 Student Loan Application System**
   - Loan applications for all classes (including playschool)
   - Integration with financial institutions
   - Eligibility checker and EMI calculator

2. **⚖️ School Comparison Tool**
   - Side-by-side comparison of schools
   - Compare fees, services, facilities, and ratings
   - Advanced filtering and sorting options

3. **🤖 AI Chatbot Assistant**
   - 24/7 intelligent support
   - School recommendations based on preferences
   - Admission guidance and FAQ assistance

4. **🎓 Alumni Connections Platform**
   - Connect with school alumni
   - Mentorship programs
   - Career guidance and networking

5. **🌍 Multi-language Support**
   - Support for 10+ Indian languages
   - Regional content localization

6. **🎯 Scholarships Discovery**
   - Comprehensive scholarship database
   - Eligibility matching
   - Application tracking

7. **💰 Fundraising Groups**
   - Community-driven fundraising
   - School infrastructure projects
   - Transparent fund management

8. **📋 Policies & Regulations Hub**
   - Safety guidelines and protocols
   - Code of conduct documentation
   - Privacy policies and uniform guidelines
   - Compliance tracking

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **i18next** - Internationalization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Primary database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File uploads
- **Socket.io** - Real-time features

### AI & External Services
- **OpenAI API** - Chatbot intelligence
- **Google Translate API** - Multi-language support
- **Google Maps API** - Location services
- **Payment Gateway** - Loan processing

### DevOps & Deployment
- **Docker** - Containerization
- **Google Cloud Platform** - Cloud hosting
- **Hostinger MySQL** - Database hosting
- **Nginx** - Reverse proxy

## 📁 Project Structure

```
SchoolDekho.in/
├── frontend/                 # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── locales/         # Language files
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── Dockerfile
├── database/                 # Database scripts
│   ├── migrations/
│   ├── seeders/
│   └── schema.sql
├── docs/                     # Documentation
├── docker-compose.yml        # Development environment
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Docker (optional)
- Google Cloud account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/schooldekho.in.git
   cd schooldekho.in
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend .env
   cp backend/.env.example backend/.env
   # Configure database, API keys, etc.

   # Frontend .env
   cp frontend/.env.example frontend/.env
   # Configure API endpoints
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   cd backend
   npm run migrate
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Port 5000)
   cd backend
   npm run dev

   # Frontend (Port 3000)
   cd frontend
   npm start
   ```

## 📊 Database Schema

### Core Tables
- `schools` - School information
- `users` - User accounts
- `reviews` - School reviews
- `applications` - Admission applications
- `loans` - Loan applications
- `scholarships` - Scholarship information
- `alumni` - Alumni profiles
- `fundraising` - Fundraising campaigns

## 🔧 Development Phases

### Phase 1: Core Foundation (Week 1-2)
- [x] Project setup and architecture
- [ ] Basic school listing and search
- [ ] User authentication system
- [ ] Database schema implementation

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Student loan application system
- [ ] School comparison tool
- [ ] Basic AI chatbot integration

### Phase 3: Community Features (Week 5-6)
- [ ] Alumni connections platform
- [ ] Scholarships discovery
- [ ] Multi-language support

### Phase 4: Advanced Features (Week 7-8)
- [ ] Fundraising groups
- [ ] Policies & regulations hub
- [ ] Advanced AI features

### Phase 5: Testing & Deployment (Week 9-10)
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- Email: support@schooldekho.in
- Phone: +91 XXXXXXXXXX
- Website: https://schooldekho.in

---

**Built with ❤️ for Indian Education System**
