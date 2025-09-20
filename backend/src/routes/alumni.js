const express = require('express');
const { Alumni, School, User } = require('../models');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/alumni?school_id=...
router.get('/', async (req, res, next) => {
  try {
    const { school_id, year } = req.query;
    const where = {};
    if (school_id) where.school_id = school_id;
    if (year) where.passing_year = parseInt(year);

    const alumni = await Alumni.findAll({ where, include: [
      { model: School, as: 'school' },
      { model: User, as: 'user', attributes: ['id','first_name','last_name','avatar'] }
    ] });
    res.json({ success: true, alumni });
  } catch (err) { next(err); }
});

// POST /api/alumni - create/update my alumni profile for a school
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const payload = { ...req.body, user_id: req.user.id };
    const existing = await Alumni.findOne({ where: { user_id: req.user.id, school_id: payload.school_id } });
    let profile;
    if (existing) { await existing.update(payload); profile = existing; }
    else { profile = await Alumni.create(payload); }
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
});

module.exports = router;
