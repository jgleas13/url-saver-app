const express = require('express');
const router = express.Router();
const { summarizeUrl } = require('../services/summarization');
const { saveUrl, getUrls } = require('../services/database');

/**
 * @route   POST /api/v1/urls
 * @desc    Receive a URL from iOS Shortcut, summarize it, and save to database
 * @access  Public (will be secured later)
 */
router.post('/', async (req, res) => {
  try {
    const { url, pageTitle, dateAccessed } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Attempt to summarize the URL content
    let summary = null;
    let tags = [];
    let processingStatus = 'completed';
    
    try {
      const summaryResult = await summarizeUrl(url);
      summary = summaryResult.summary;
      tags = summaryResult.tags || [];
    } catch (error) {
      console.error('Summarization error:', error);
      processingStatus = 'failed';
      // We continue despite summarization failure
    }

    // Save the URL to the database
    const savedUrl = await saveUrl({
      url,
      pageTitle: pageTitle || url, // Use URL as title if none provided
      dateAccessed: dateAccessed || new Date().toISOString(),
      summary,
      tags,
      processingStatus,
    });

    res.status(201).json(savedUrl);
  } catch (error) {
    console.error('Error handling URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});

/**
 * @route   GET /api/v1/urls
 * @desc    Get all saved URLs with their metadata
 * @access  Public (will be secured later)
 */
router.get('/', async (req, res) => {
  try {
    const urls = await getUrls();
    res.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Failed to retrieve URLs' });
  }
});

module.exports = router; 