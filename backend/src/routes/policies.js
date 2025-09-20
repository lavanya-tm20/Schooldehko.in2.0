const express = require('express');
const { Op } = require('sequelize');
const { Policy, School } = require('../models');

const router = express.Router();

// GET /api/policies?q=...&type=...&school_id=...&limit=...&offset=...
router.get('/', async (req, res, next) => {
  try {
    const { q, type, school_id, limit = 20, offset = 0 } = req.query;
    const where = {};
    if (type) where.type = type;
    if (school_id) where.school_id = school_id;
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }
      ];
    }

    const result = await Policy.findAndCountAll({
      where,
      limit: Math.min(parseInt(limit), 100),
      offset: parseInt(offset),
      include: [{ model: School, as: 'school', attributes: ['id','name','city','state'] }],
      order: [['created_at','DESC']]
    });

    res.json({ success: true, count: result.count, policies: result.rows });
  } catch (err) { next(err); }
});

module.exports = router;
