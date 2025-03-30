/**
 * Test script for the Grok AI summarization service
 * 
 * Run with: node test-summarization.js <url>
 * Example: node test-summarization.js https://developer.mozilla.org/en-US/
 */

require('dotenv').config();
const { summarizeUrl } = require('./services/summarization');

// Get URL from command line argument or use default
const testUrl = process.argv[2] || 'https://developer.mozilla.org/en-US/';

console.log(`Testing Grok AI summarization for URL: ${testUrl}`);
console.log('Grok API Key:', process.env.GROK_API_KEY ? 'Found' : 'Not found or invalid');

// Wrap in an async function to use await
async function runTest() {
  try {
    console.log('Calling Grok AI summarization service...');
    console.time('Summarization completed in');
    
    const result = await summarizeUrl(testUrl);
    
    console.timeEnd('Summarization completed in');
    console.log('\nResult:');
    console.log('------------');
    console.log('Summary:', result.summary);
    console.log('Tags:', result.tags.join(', '));
    console.log('------------');
    
    if (result.tags.includes('mock')) {
      console.log('\nWARNING: Using mock data instead of actual Grok AI. To use the real Grok AI service:');
      console.log('1. Make sure you have a valid Grok API key');
      console.log('2. Add it to your .env file as GROK_API_KEY=your-actual-key');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 