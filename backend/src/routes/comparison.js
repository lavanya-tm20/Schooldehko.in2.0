const express = require('express');
const { Comparison, School } = require('../models');
const { attachUser, requireAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();
router.use(attachUser);

// POST /api/comparison
// body: { schoolIds: [id1, id2, ...], listId?: string }
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { schoolIds = [], listId = null } = req.body;
    if (!Array.isArray(schoolIds) || schoolIds.length < 2)
      return res.status(400).json({ success: false, message: 'Provide at least two school IDs to compare' });

    // Fetch schools
    const schools = await School.findAll({ where: { id: { [Op.in]: schoolIds } } });
    if (schools.length < 2) return res.status(400).json({ success: false, message: 'Invalid school IDs provided' });

    // Persist comparison snapshot for user history
    const created = [];
    for (const school of schools) {
      const snapshot = {
        fees: school.fees,
        facilities: school.facilities,
        rating: school.rating,
        total_reviews: school.total_reviews,
        board: school.board,
        school_type: school.school_type,
        city: school.city,
        state: school.state
      };
      created.push(await Comparison.create({ user_id: req.user.id, school_id: school.id, list_id: listId, attributes_snapshot: snapshot }));
    }

    res.status(201).json({ success: true, schools });
  } catch (err) { next(err); }
});

// GET /api/comparison?listId=...
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { listId } = req.query;
    const where = { user_id: req.user.id };
    if (listId) where.list_id = listId;
    const items = await Comparison.findAll({ where, include: [{ model: School, as: 'school' }] });
    res.json({ success: true, items });
  } catch (err) { next(err); }
});

module.exports = router;
