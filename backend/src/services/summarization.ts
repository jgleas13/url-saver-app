import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Interface for summarization result
export interface SummarizationResult {
  summary: string | null;
  tags: string[];
  status: 'completed' | 'failed';
  error?: string;
}

/**
 * Generate a summary of a webpage content using Grok AI
 * 
 * @param url The URL of the webpage to summarize
 * @param pageTitle The title of the webpage (for context)
 * @returns A summary of the webpage and detected tags
 */
export const generateSummary = async (url: string, pageTitle: string): Promise<SummarizationResult> => {
  try {
    // In a real implementation, this would make an API call to Grok AI
    // For now, we'll simulate the API call

    // Check for a valid API key
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error('Grok API key not configured');
    }

    // Simulate a network request
    console.log(`Generating summary for URL: ${url} with title: ${pageTitle}`);
    
    // For this example, we'll randomly succeed or fail (90% success rate)
    const shouldSucceed = Math.random() < 0.9;
    
    if (!shouldSucceed) {
      throw new Error('Failed to generate summary');
    }
    
    // Simulate a delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Placeholder for real Grok API integration
    // In a real implementation, you would:
    // 1. Make a fetch/axios request to the Grok API endpoint
    // 2. Send the URL and any required parameters
    // 3. Parse the response to extract summary and tags
    
    // Mock response for development
    const mockResponse = {
      summary: `This is an AI-generated summary of the content at ${pageTitle}. The webpage discusses key points related to the topic and provides useful information to readers.`,
      tags: generateMockTags(pageTitle)
    };
    
    return {
      summary: mockResponse.summary,
      tags: mockResponse.tags,
      status: 'completed'
    };
    
  } catch (error: any) {
    console.error('Error in Grok summarization:', error);
    return {
      summary: null,
      tags: [],
      status: 'failed',
      error: error.message || 'Unknown error during summarization'
    };
  }
};

/**
 * Generate mock tags based on page title for development
 */
function generateMockTags(pageTitle: string): string[] {
  const possibleTags = ['technology', 'business', 'health', 'science', 'education', 'entertainment', 'sports', 'politics', 'food', 'travel'];
  
  // Get 1-3 random tags
  const numTags = Math.floor(Math.random() * 3) + 1;
  const shuffledTags = [...possibleTags].sort(() => 0.5 - Math.random());
  return shuffledTags.slice(0, numTags);
} 