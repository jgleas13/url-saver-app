/**
 * Service for summarizing URLs using Grok AI
 */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

/**
 * Summarize a URL using Grok AI API
 * @param {string} url - The URL to summarize
 * @returns {Promise<Object>} - Object containing summary and tags
 */
const summarizeUrl = async (url) => {
  try {
    console.log(`Summarizing URL: ${url}`);
    
    const grokApiKey = process.env.GROK_API_KEY;
    if (!grokApiKey || grokApiKey === 'your-grok-api-key') {
      console.warn('No valid Grok API key found. Using mock data instead.');
      return getMockSummary(url);
    }
    
    // First, fetch the content of the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL content: ${response.status}`);
    }
    
    const htmlContent = await response.text();
    
    // Extract text content from HTML to make it easier to process
    const textContent = extractTextFromHtml(htmlContent);
    
    // Trim content to a reasonable size
    const trimmedContent = textContent.slice(0, 8000);
    
    // Call the Grok AI API for summarization using the OpenAI-compatible interface
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokApiKey}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes web content and extracts relevant tags."
          },
          {
            role: "user",
            content: `Summarize the following web page content in a concise paragraph (3-4 sentences). 
            Also provide 3-5 relevant tags that categorize this content.
            Format your response as a JSON object with 'summary' and 'tags' (array) fields.
            
            Web content:
            ${trimmedContent}`
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });
    
    if (!grokResponse.ok) {
      const errorData = await grokResponse.json().catch(() => ({}));
      console.error('Grok API Error:', errorData);
      throw new Error(`Grok API Error: ${grokResponse.status}`);
    }
    
    const grokData = await grokResponse.json();
    
    // Parse the response from Grok
    try {
      // Access the message content
      const content = grokData.choices[0].message.content.trim();
      
      // Try to parse JSON from the response
      try {
        const parsedResponse = JSON.parse(content);
        return {
          summary: parsedResponse.summary,
          tags: parsedResponse.tags || extractTags(parsedResponse.summary)
        };
      } catch (jsonError) {
        // If it's not valid JSON, try to extract with regex
        const summaryMatch = content.match(/summary["\s:]+([^"]*)/i);
        const tagsMatch = content.match(/tags["\s:]+\[(.*?)\]/i);
        
        const summary = summaryMatch && summaryMatch[1] ? 
          summaryMatch[1].replace(/"/g, '').trim() : 
          content.substring(0, 300); // Use the first part as summary
        
        let tags = [];
        if (tagsMatch && tagsMatch[1]) {
          tags = tagsMatch[1].split(',')
            .map(tag => tag.replace(/"/g, '').trim())
            .filter(tag => tag);
        }
        
        return {
          summary: summary,
          tags: tags.length > 0 ? tags : extractTags(summary)
        };
      }
    } catch (parseError) {
      console.error('Error parsing Grok response:', parseError);
      
      // As a fallback, use the raw response as the summary
      const rawContent = grokData.choices && 
        grokData.choices[0] && 
        grokData.choices[0].message && 
        grokData.choices[0].message.content ? 
        grokData.choices[0].message.content.trim() : 
        `Summarized content from ${url}`;
        
      return {
        summary: rawContent.substring(0, 500),
        tags: extractTags(url)
      };
    }
    
  } catch (error) {
    console.error('Error in summarization service:', error);
    // If there's an error, still return some data so the URL is saved
    return {
      summary: `Failed to generate summary for ${url}. Error: ${error.message}`,
      tags: ['error', 'processing-failed'],
    };
  }
};

/**
 * Extract text content from HTML
 * @param {string} html - HTML content
 * @returns {string} - Extracted text
 */
const extractTextFromHtml = (html) => {
  // Basic HTML text extraction - remove tags and decode entities
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
};

/**
 * Extract potential tags from text
 * @param {string} text - Text to extract tags from
 * @returns {string[]} - Array of extracted tags
 */
const extractTags = (text) => {
  if (!text) return ['untagged'];
  
  // Simple tag extraction logic
  const potentialTags = [
    'technology', 'programming', 'javascript', 'python', 'react', 'node', 
    'development', 'tutorial', 'guide', 'news', 'article', 'blog', 'review',
    'product', 'service', 'tool', 'data', 'ai', 'machine learning', 'world',
    'politics', 'science', 'health', 'business', 'sports', 'entertainment'
  ];
  
  const textLower = text.toLowerCase();
  return potentialTags.filter(tag => textLower.includes(tag.toLowerCase()))
    .slice(0, 5)  // Limit to 5 tags max
    || ['general']; // Fallback if no tags found
};

/**
 * Get mock summary and tags for testing
 * @param {string} url - URL to mock summarize
 * @returns {Object} - Mock summary and tags
 */
const getMockSummary = (url) => {
  return {
    summary: `This is a simulated summary of the content found at ${url}. The Grok AI service would generate a few concise sentences describing the key points of the webpage.`,
    tags: ['mock', 'development', 'placeholder'],
  };
};

module.exports = {
  summarizeUrl,
}; 