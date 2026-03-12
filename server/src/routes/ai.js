const express = require('express');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/ai.service');

const router = express.Router();

router.use(authMiddleware);

// POST /api/ai/summarize
router.post('/summarize', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await aiService.summarizePaper(text);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/keywords
router.post('/keywords', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const keywords = await aiService.extractKeywords(text);
    res.json({ keywords });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/gaps
router.post('/gaps', async (req, res, next) => {
  try {
    const { projectContext } = req.body;
    if (!projectContext) {
      return res.status(400).json({ error: 'Project context is required' });
    }

    const gaps = await aiService.generateResearchGaps(projectContext);
    res.json({ gaps });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/connections
router.post('/connections', async (req, res, next) => {
  try {
    const { insights } = req.body;
    if (!insights || !Array.isArray(insights) || insights.length === 0) {
      return res.status(400).json({ error: 'Insights array is required' });
    }

    const connections = await aiService.suggestConnections(insights);
    res.json({ connections });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
  try {
    const { message, projectContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.chatWithAI(message, projectContext || '');
    res.json({ response });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
