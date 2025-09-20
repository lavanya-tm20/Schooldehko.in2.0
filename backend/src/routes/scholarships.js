const express = require('express');
const { Scholarship } = require('../models');
const { Op } = require('sequelize');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/scholarships - list/filter scholarships
router.get('/', async (req, res, next) => {
  try {
    const { q, type, openOnly, page = 1, limit = 20 } = req.query;
    const where = { is_active: true };

    if (q) where.name = { [Op.like]: `%${q}%` };
    if (type) where.scholarship_type = type;
    if (openOnly === 'true') {
      const now = new Date();
      where.application_start_date = { [Op.lte]: now };
      where.application_end_date = { [Op.gte]: now };
    }

    const result = await Scholarship.findAndCountAll({
      where,
      order: [['application_end_date', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({ success: true, ...result });
  } catch (err) { next(err); }
});

// GET /api/scholarships/:id - details
router.get('/:id', async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: 'Scholarship not found' });
    res.json({ success: true, scholarship });
  } catch (err) { next(err); }
});

module.exports = router;
