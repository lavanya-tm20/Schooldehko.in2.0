require('dotenv').config();
const db = require('../config/database');
const { School, User, Alumni, Scholarship, Policy, Fundraising, Loan } = require('../models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    await db.authenticate();
    // Dev mode: force sync to avoid FK constraint errors from prior states
    const syncOptions = { force: true };
    console.warn('[DEV] Forcing schema sync: this will DROP and recreate all tables.');
    await db.sync(syncOptions);

    // Create an admin user for testing (idempotent)
    const adminEmail = 'admin@schooldekho.in';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Admin@123', salt);
    let [admin, createdAdmin] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        password: hashed,
        role: 'super_admin',
        phone: '+911234567890'
      }
    });
    console.log(createdAdmin ? 'Created admin user: admin@schooldekho.in / Admin@123' : 'Admin user already exists: ' + adminEmail);

    // Create sample schools sequentially with detailed error output
    const samples = [
      {
        name: 'Green Valley Public School',
        school_type: 'day_school',
        board: 'cbse',
        medium: ['english', 'hindi'],
        classes_offered: ['nursery','lkg','ukg', '1','2','3','4','5','6','7','8','9','10','11','12'],
        email: 'contact@gvps.edu',
        phone: '+911112223334',
        website: 'https://gvps.edu',
        address: '12, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        rating: 4.3,
        fees: { admission_fee: 25000, annual_fee: 60000, monthly_fee: 5000, transport_fee: 1200, other_fees: {} },
        facilities: ['Library','Science Lab','Playground','Transport','CCTV','Smart Classes'],
        is_verified: true
      },
      {
        name: 'Sunrise International School',
        school_type: 'boarding_school',
        board: 'ib',
        medium: ['english'],
        classes_offered: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        email: 'info@sunrise.edu',
        phone: '+911556667778',
        website: 'https://sunrise.edu',
        address: '45, Lake View',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        rating: 4.6,
        fees: { admission_fee: 50000, annual_fee: 120000, monthly_fee: 10000, transport_fee: 0, other_fees: {} },
        facilities: ['Hostel','Library','Swimming Pool','Transport','Cafeteria','CCTV'],
        is_verified: true
      }
    ];

    for (const s of samples) {
      try {
        const existing = await School.findOne({ where: { name: s.name } });
        if (existing) {
          console.log('School already exists, skipping:', existing.name);
        } else {
          const created = await School.create(s);
          console.log('Inserted school:', created.name, 'slug=', created.slug);
        }
      } catch (err) {
        console.error('Failed to insert school:', s.name);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.errors) console.error('Validation errors:', err.errors.map(e => `${e.path}: ${e.message}`).join('; '));
        throw err;
      }
    }

    // Resolve school IDs for associations
    const gvps = await School.findOne({ where: { name: 'Green Valley Public School' } });
    const sis = await School.findOne({ where: { name: 'Sunrise International School' } });

    // Seed Alumni (3)
    const alumniSamples = [
      { user_id: admin.id, school_id: gvps?.id, passing_year: 2019, current_company: 'Infosys', designation: 'Software Engineer', bio: 'Gold medalist, Math Club lead' },
      { user_id: admin.id, school_id: gvps?.id, passing_year: 2020, current_company: 'TCS', designation: 'Analyst', bio: 'Debate champion, Robotics team' },
      { user_id: admin.id, school_id: sis?.id, passing_year: 2018, current_company: 'Accenture', designation: 'Consultant', bio: 'State-level swimmer' }
    ];
    for (const a of alumniSamples) {
      const exists = await Alumni.findOne({ where: { school_id: a.school_id, passing_year: a.passing_year, current_company: a.current_company } });
      if (!exists) { await Alumni.create(a); console.log('Inserted alumni:', a.current_company, a.passing_year); }
    }

    // Seed Scholarships (3)
    const today = new Date();
    const in60 = new Date(Date.now() + 60*24*60*60*1000);
    const scholarships = [
      {
        name: 'Merit Excellence Scholarship',
        provider: 'Govt of India',
        scholarship_type: 'merit',
        description: 'Awarded to top performers across boards',
        amount: 50000,
        amount_type: 'annual',
        eligibility_criteria: { min_percentage: 90, classes: ['10','11','12'], boards: ['cbse','icse','ib'], family_income_limit: null },
        required_documents: ['Aadhaar', 'Marksheet'],
        application_process: 'Apply online via the official portal with required documents.',
        application_start_date: today,
        application_end_date: in60
      },
      {
        name: 'Need-Based Support',
        provider: 'EduCare Trust',
        scholarship_type: 'need_based',
        description: 'Supports students from low-income families',
        amount: 30000,
        amount_type: 'annual',
        eligibility_criteria: { family_income_limit: 300000, classes: ['1','2','3','4','5','6','7','8','9','10'], boards: [] },
        required_documents: ['Income Certificate', 'Address Proof'],
        application_process: 'Submit application through NGO partner site and upload income certificate.',
        application_start_date: today,
        application_end_date: in60
      },
      {
        name: 'Sports Achiever Grant',
        provider: 'Sports Authority',
        scholarship_type: 'sports',
        description: 'For state/national level athletes',
        amount: 40000,
        amount_type: 'annual',
        eligibility_criteria: { category: ['sports'], other_criteria: ['state_level','national_level'] },
        required_documents: ['Sports Certificates'],
        application_process: 'Apply via Sports Authority portal and attach participation certificates.',
        application_start_date: today,
        application_end_date: in60
      }
    ];
    for (const sc of scholarships) {
      const exists = await Scholarship.findOne({ where: { name: sc.name } });
      if (!exists) { await Scholarship.create(sc); console.log('Inserted scholarship:', sc.name); }
    }

    // Seed Policies (2+)
    const policies = [
      { school_id: gvps?.id, title: 'Admission Policy', type: 'admission', content: 'Transparent admission criteria with sibling preference and RTE compliance.' },
      { school_id: gvps?.id, title: 'Discipline Policy', type: 'code_of_conduct', content: 'Zero tolerance for bullying. Positive discipline framework in place.' },
      { school_id: sis?.id, title: 'Refund Policy', type: 'fees', content: 'Admission fee non-refundable. Term fee refundable before term starts minus processing charges.' }
    ];
    for (const p of policies) {
      const exists = await Policy.findOne({ where: { school_id: p.school_id, title: p.title } });
      if (!exists) { await Policy.create(p); console.log('Inserted policy:', p.title); }
    }

    // Seed Fundraising (2)
    const campaigns = [
      { school_id: gvps?.id, title: 'Library Upgrade', description: 'Add 1000 new books and digital catalog.', goal_amount: 100000, raised_amount: 25000, deadline: in60, created_by: admin.id },
      { school_id: sis?.id, title: 'Playground Renovation', description: 'New turf and safety equipment.', goal_amount: 150000, raised_amount: 40000, deadline: in60, created_by: admin.id }
    ];
    for (const c of campaigns) {
      const exists = await Fundraising.findOne({ where: { school_id: c.school_id, title: c.title } });
      if (!exists) { await Fundraising.create(c); console.log('Inserted campaign:', c.title); }
    }

    // Seed Loans (2 sample applications as demo data)
    const loans = [
      { user_id: admin.id, school_id: gvps?.id, student_name: 'Riya Sharma', student_class: '1', student_age: 7, parent_name: 'Ankit Sharma', parent_occupation: 'Engineer', annual_income: 600000, loan_amount_requested: 80000, loan_tenure_months: 12, loan_purpose: 'complete_education', employment_type: 'salaried', work_experience_years: 4, monthly_income: 50000, interest_rate: 12 },
      { user_id: admin.id, school_id: sis?.id, student_name: 'Arjun Verma', student_class: '5', student_age: 10, parent_name: 'Neha Verma', parent_occupation: 'Doctor', annual_income: 1200000, loan_amount_requested: 120000, loan_tenure_months: 18, loan_purpose: 'annual_fee', employment_type: 'professional', work_experience_years: 8, monthly_income: 100000, interest_rate: 11 }
    ];
    for (const l of loans) {
      const exists = await Loan.findOne({ where: { user_id: l.user_id, school_id: l.school_id, loan_amount_requested: l.loan_amount_requested } });
      if (!exists) { await Loan.create(l); console.log('Inserted demo loan for student:', l.student_name); }
    }

    console.log('Dev seed completed');
    process.exit(0);
  } catch (e) {
    console.error('Seed error', e);
    process.exit(1);
  }
}

run();
