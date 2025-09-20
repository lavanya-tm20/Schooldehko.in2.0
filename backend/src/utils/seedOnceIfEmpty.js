const { School, User, Alumni, Scholarship, Policy, Fundraising, Loan } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * Ensure admin exists and seed demo data when required.
 * Returns true if demo data was seeded; always ensures admin account.
 */
module.exports = async function seedOnceIfEmpty() {
  // Always ensure the admin user exists even if DB already has data
  const adminEmail = 'admin@schooldekho.in';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('Admin@123', salt);
  const [admin] = await User.findOrCreate({
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

  // Only seed demo dataset if there are zero schools (idempotent light check)
  const schoolCount = await School.count();
  if (schoolCount > 0) return false;

  // Seed two example schools
  const schools = [
    {
      name: 'Green Valley Public School',
      school_type: 'day_school',
      board: 'cbse',
      medium: ['english', 'hindi'],
      classes_offered: ['nursery','lkg','ukg','1','2','3','4','5','6','7','8','9','10','11','12'],
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

  for (const s of schools) {
    await School.findOrCreate({ where: { name: s.name }, defaults: s });
  }

  // Reload schools for IDs
  const gvps = await School.findOne({ where: { name: 'Green Valley Public School' } });
  const sis = await School.findOne({ where: { name: 'Sunrise International School' } });

  // Alumni
  const alumni = [
    { user_id: admin.id, school_id: gvps?.id, passing_year: 2019, current_company: 'Infosys', designation: 'Software Engineer', bio: 'Gold medalist, Math Club lead' },
    { user_id: admin.id, school_id: sis?.id, passing_year: 2018, current_company: 'Accenture', designation: 'Consultant', bio: 'State-level swimmer' }
  ];
  for (const a of alumni) {
    await Alumni.findOrCreate({ where: { school_id: a.school_id, passing_year: a.passing_year, current_company: a.current_company }, defaults: a });
  }

  // Scholarships (minimal, with required fields)
  const today = new Date();
  const in60 = new Date(Date.now() + 60*24*60*60*1000);
  const scholarships = [
    {
      name: 'Merit Excellence Scholarship', provider: 'Govt of India', scholarship_type: 'merit', description: 'Top performers', amount: 50000, amount_type: 'annual',
      eligibility_criteria: { min_percentage: 90, classes: ['10','11','12'], boards: ['cbse','icse','ib'] }, required_documents: ['Aadhaar','Marksheet'], application_process: 'Apply online',
      application_start_date: today, application_end_date: in60
    },
    {
      name: 'Need-Based Support', provider: 'EduCare Trust', scholarship_type: 'need_based', description: 'Low-income support', amount: 30000, amount_type: 'annual',
      eligibility_criteria: { family_income_limit: 300000, classes: ['1','2','3','4','5','6','7','8','9','10'] }, required_documents: ['Income Certificate'], application_process: 'Submit via NGO',
      application_start_date: today, application_end_date: in60
    }
  ];
  for (const sc of scholarships) {
    await Scholarship.findOrCreate({ where: { name: sc.name }, defaults: sc });
  }

  // Policies
  const policies = [
    { school_id: gvps?.id, title: 'Admission Policy', type: 'admission', content: 'Transparent criteria with RTE compliance.' },
    { school_id: sis?.id, title: 'Refund Policy', type: 'fees', content: 'Term fee refundable before term minus processing.' }
  ];
  for (const p of policies) {
    await Policy.findOrCreate({ where: { school_id: p.school_id, title: p.title }, defaults: p });
  }

  // Fundraising
  const campaigns = [
    { school_id: gvps?.id, title: 'Library Upgrade', description: 'Add 1000 books.', goal_amount: 100000, raised_amount: 25000, deadline: in60 },
    { school_id: sis?.id, title: 'Playground Renovation', description: 'New turf and safety equipment.', goal_amount: 150000, raised_amount: 40000, deadline: in60 }
  ];
  for (const c of campaigns) {
    await Fundraising.findOrCreate({ where: { school_id: c.school_id, title: c.title }, defaults: c });
  }

  // Loans (demo)
  const loans = [
    { user_id: admin.id, school_id: gvps?.id, student_name: 'Riya Sharma', student_class: '1', student_age: 7, parent_name: 'Ankit Sharma', parent_occupation: 'Engineer', annual_income: 600000, loan_amount_requested: 80000, loan_tenure_months: 12, loan_purpose: 'complete_education', employment_type: 'salaried', work_experience_years: 4, monthly_income: 50000, interest_rate: 12 },
    { user_id: admin.id, school_id: sis?.id, student_name: 'Arjun Verma', student_class: '5', student_age: 10, parent_name: 'Neha Verma', parent_occupation: 'Doctor', annual_income: 1200000, loan_amount_requested: 120000, loan_tenure_months: 18, loan_purpose: 'annual_fee', employment_type: 'professional', work_experience_years: 8, monthly_income: 100000, interest_rate: 11 }
  ];
  for (const l of loans) {
    await Loan.findOrCreate({ where: { user_id: l.user_id, school_id: l.school_id, loan_amount_requested: l.loan_amount_requested }, defaults: l });
  }

  return true;
};
