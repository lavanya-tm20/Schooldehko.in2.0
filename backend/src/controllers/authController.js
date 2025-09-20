const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

function signToken(user) {
  const payload = { id: user.id, role: user.role, name: user.getFullName() };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password, phone } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Ensure password is hashed (model hook will hash if needed)
    const user = await User.create({ first_name, last_name, email, password, phone });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Use bcrypt.compare to validate
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    user.last_login = new Date();
    await user.save();
    res.json({ token, user });
  } catch (err) { next(err); }
}

module.exports = { register, login };
