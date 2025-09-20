const express = require('express');
const { Op } = require('sequelize');
const { School, Policy, Review } = require('../models');
const { attachUser, requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/schools - list/search
router.get('/', async (req, res, next) => {
  try {
    const { q, city, state, board, type, minRating, page = 1, limit = 20 } = req.query;
    const where = { is_active: true };

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (city) where.city = city;
    if (state) where.state = state;
    if (board) where.board = board;
    if (type) where.school_type = type;
    if (minRating) where.rating = { [Op.gte]: parseFloat(minRating) };

    const result = await School.findAndCountAll({
      where,
      order: [['rating', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

// GET /api/schools/:id - details
router.get('/:id', async (req, res, next) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });
    res.json({ success: true, school });
  } catch (err) { next(err); }
});

// GET /api/schools/:id/policies - policies for a school
router.get('/:id/policies', async (req, res, next) => {
  try {
    const policies = await Policy.findAll({ where: { school_id: req.params.id, is_active: true } });
    res.json({ success: true, policies });
  } catch (err) { next(err); }
});

// GET /api/schools/:id/reviews - reviews for a school
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({ where: { school_id: req.params.id, status: 'approved' }, order: [['created_at', 'DESC']] });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

// POST /api/schools - create school (admin)
router.post('/', requireAuth, requireRole('school_admin', 'super_admin'), async (req, res, next) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json({ success: true, school });
  } catch (err) { next(err); }
});

// PATCH /api/schools/:id - update school (admin)
router.patch('/:id', requireAuth, requireRole('school_admin', 'super_admin'), async (req, res, next) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });
    await school.update(req.body);
    res.json({ success: true, school });
  } catch (err) { next(err); }
});

module.exports = router;
