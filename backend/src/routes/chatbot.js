const express = require('express');
const { ChatMessage } = require('../models');
const { attachUser } = require('../middleware/auth');

const router = express.Router();
router.use(attachUser);

// POST /api/chatbot/message - basic placeholder until OpenAI is configured
router.post('/message', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    // Save user message
    const userMsg = await ChatMessage.create({
      user_id: req.user ? req.user.id : null,
      role: 'user',
      message
    });

    // Placeholder assistant reply (replace with OpenAI integration later)
    const replyText = "Thanks for reaching out! I can help you search schools, compare fees/services, explore scholarships, and apply for education loans. What city and board are you interested in?";

    const assistantMsg = await ChatMessage.create({
      user_id: req.user ? req.user.id : null,
      role: 'assistant',
      message: replyText
    });

    res.json({ success: true, messages: [userMsg, assistantMsg] });
  } catch (err) { next(err); }
});

module.exports = router;
