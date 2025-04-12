/**
 * Service for summarizing URLs using OpenAI
 */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

/**
 * Summarize a URL using OpenAI API
 * @param {string} url - The URL to summarize
 * @returns {Promise<Object>} - Object containing summary and tags
 */
const summarizeUrl = async (url) => {
  try {
    console.log(`Summarizing URL: ${url}`);
    
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.warn('No valid OpenAI API key found. Using mock data instead.');
      return getMockSummary(url);
    }
    
    // Call OpenAI API directly with the URL
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes web content and extracts relevant tags."
          },
          {
            role: "user",
            content: `Given this URL: ${url}
            
            1. Extract a concise, engaging title for this content (5-10 words).
            2. Summarize the content in a concise paragraph (3-4 sentences).
            3. Provide 3-5 relevant tags that categorize this content.
            
            Format your response as a JSON object with these fields:
            - 'title': The extracted title
            - 'summary': The content summary
            - 'tags': Array of relevant tags`
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
      })
    });
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${openaiResponse.status}`);
    }
    
    const openaiData = await openaiResponse.json();
    
    // Parse the response from OpenAI
    try {
      // Access the message content
      const content = openaiData.choices[0].message.content.trim();
      
      // Try to parse JSON from the response
      try {
        const parsedResponse = JSON.parse(content);
        return {
          title: parsedResponse.title || extractTitleFromUrl(url),
          summary: parsedResponse.summary,
          tags: parsedResponse.tags || ['untagged']
        };
      } catch (jsonError) {
        // If it's not valid JSON, try to extract with regex
        const titleMatch = content.match(/title["\s:]+([^"]*)/i);
        const summaryMatch = content.match(/summary["\s:]+([^"]*)/i);
        const tagsMatch = content.match(/tags["\s:]+\[(.*?)\]/i);
        
        const title = titleMatch && titleMatch[1] ? 
          titleMatch[1].replace(/"/g, '').trim() : 
          extractTitleFromUrl(url);
        
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
          title,
          summary,
          tags: tags.length > 0 ? tags : ['untagged']
        };
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      
      // As a fallback, use the raw response as the summary
      const rawContent = openaiData.choices && 
        openaiData.choices[0] && 
        openaiData.choices[0].message && 
        openaiData.choices[0].message.content ? 
        openaiData.choices[0].message.content.trim() : 
        `Failed to summarize content from ${url}`;
        
      return {
        title: extractTitleFromUrl(url),
        summary: rawContent.substring(0, 500),
        tags: ['error', 'parsing-failed']
      };
    }
  } catch (error) {
    console.error('Error in summarization service:', error);
    throw error;
  }
};

/**
 * Extract a title from a URL if no AI-generated title is available
 * @param {string} url - The URL to extract a title from
 * @returns {string} - Extracted title
 */
const extractTitleFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    
    let pathSegment = "";
    if (urlObj.pathname && urlObj.pathname !== "/" && urlObj.pathname.length > 1) {
      const segments = urlObj.pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        pathSegment = segments[segments.length - 1]
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .replace(/\.\w+$/, "");
      }
    }
    
    if (pathSegment) {
      return pathSegment.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      return hostname.charAt(0).toUpperCase() + hostname.slice(1) + " Page";
    }
  } catch (error) {
    console.error("Error extracting title from URL:", error);
    return "Untitled Page";
  }
};

/**
 * Get mock summary and tags for testing
 * @param {string} url - URL to mock summarize
 * @returns {Object} - Mock summary and tags
 */
const getMockSummary = (url) => {
  return {
    title: extractTitleFromUrl(url),
    summary: `This is a simulated summary of the content found at ${url}. The OpenAI service would generate a few concise sentences describing the key points of the webpage.`,
    tags: ['mock', 'development', 'placeholder'],
  };
};

module.exports = {
  summarizeUrl,
}; 