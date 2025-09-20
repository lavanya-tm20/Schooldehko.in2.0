const express = require('express');
const { Fundraising } = require('../models');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/fundraising?school_id=...
router.get('/', async (req, res, next) => {
  try {
    const { school_id } = req.query;
    const where = { is_active: true };
    if (school_id) where.school_id = school_id;
    const campaigns = await Fundraising.findAll({ where, order: [['created_at', 'DESC']] });
    res.json({ success: true, campaigns });
  } catch (err) { next(err); }
});

// POST /api/fundraising - create new campaign
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = { ...req.body, created_by: req.user.id };
    const campaign = await Fundraising.create(data);
    res.status(201).json({ success: true, campaign });
  } catch (err) { next(err); }
});

// PATCH /api/fundraising/:id - update campaign by owner
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const campaign = await Fundraising.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    if (campaign.created_by !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    await campaign.update(req.body);
    res.json({ success: true, campaign });
  } catch (err) { next(err); }
});

module.exports = router;
