const express = require('express');
const { User } = require('../models');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/users/me - current user profile
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/users/me - update profile
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update(req.body);
    await user.updateProfileCompletion();
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

module.exports = router;
