const express = require('express');
const { Loan, School } = require('../models');
const { attachUser, requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// GET /api/loans - list my loan applications
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const loans = await Loan.findByUser(req.user.id, { include: [{ model: School, as: 'school' }] });
    res.json({ success: true, loans });
  } catch (err) { next(err); }
});

// POST /api/loans - create new loan application (for any class incl. playschool)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const payload = { ...req.body, user_id: req.user.id };
    const loan = await Loan.create(payload);
    loan.calculateEligibilityScore();
    res.status(201).json({ success: true, loan });
  } catch (err) { next(err); }
});

// GET /api/loans/:id - loan details
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan || loan.user_id !== req.user.id) return res.status(404).json({ success: false, message: 'Loan not found' });
    res.json({ success: true, loan });
  } catch (err) { next(err); }
});

// PATCH /api/loans/:id - update loan (only in draft/submitted)
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan || loan.user_id !== req.user.id) return res.status(404).json({ success: false, message: 'Loan not found' });
    if (!['draft', 'submitted', 'documents_required'].includes(loan.application_status)) {
      return res.status(400).json({ success: false, message: 'Loan cannot be edited at this stage' });
    }
    await loan.update(req.body);
    loan.calculateEligibilityScore();
    res.json({ success: true, loan });
  } catch (err) { next(err); }
});

module.exports = router;
