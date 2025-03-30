import express, { Request, Response } from 'express';
import { generateSummary } from '../services/summarization';
import { storeUrl, getUrlsByUser, getUrlById, UrlEntry } from '../services/database';

const router = express.Router();

/**
 * POST /api/v1/urls
 * Endpoint to receive a URL from iOS Shortcut, process it, and store it
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { url, title, dateAccessed, userId } = req.body;
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'URL is required'
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Authentication error',
        message: 'User ID is required'
      });
    }
    
    // Prepare URL entry with initial pending status
    const urlEntry: UrlEntry = {
      url,
      title: title || url, // Use URL if title is not provided
      dateAccessed: dateAccessed || new Date().toISOString(),
      summary: null,
      processingStatus: 'pending',
      tags: [],
      userId
    };
    
    // Store the URL with pending status
    const savedUrl = await storeUrl(urlEntry);
    
    // Generate summary using Grok AI (this could be done asynchronously)
    const summaryResult = await generateSummary(url, urlEntry.title);
    
    // Update the URL with the summary result
    const updatedUrl = await storeUrl({
      ...savedUrl,
      summary: summaryResult.summary,
      processingStatus: summaryResult.status,
      tags: summaryResult.tags
    });
    
    return res.status(201).json({
      success: true,
      data: updatedUrl
    });
  } catch (error: any) {
    console.error('Error processing URL:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Error processing URL'
    });
  }
});

/**
 * GET /api/v1/urls
 * Get all URLs for a user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter',
        message: 'User ID is required'
      });
    }
    
    const urls = await getUrlsByUser(userId);
    
    return res.status(200).json({
      success: true,
      data: urls
    });
  } catch (error: any) {
    console.error('Error fetching URLs:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Error fetching URLs'
    });
  }
});

/**
 * GET /api/v1/urls/:id
 * Get a specific URL by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const url = await getUrlById(id);
    
    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'URL not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: url
    });
  } catch (error: any) {
    console.error('Error fetching URL:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Error fetching URL'
    });
  }
});

export default router; 