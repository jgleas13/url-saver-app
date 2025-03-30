const fetch = require('node-fetch');

// Get command line arguments
const apiKey = process.argv[2];
const url = process.argv[3] || 'https://example.com';
const apiBaseUrl = process.argv[4] || 'https://us-central1-url-saver-app-123.cloudfunctions.net';

if (!apiKey) {
  console.error('Error: API key is required');
  console.log('Usage: node test-api-direct.js <api_key> [url] [api_base_url]');
  process.exit(1);
}

// Test function to make a request to the API
async function testApiEndpoint() {
  console.log(`\n=== API Endpoint Test ===`);
  console.log(`API Base URL: ${apiBaseUrl}`);
  console.log(`API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Testing with URL: ${url}\n`);
  
  try {
    console.log(`Sending request to ${apiBaseUrl}/processUrl`);
    
    const response = await fetch(`${apiBaseUrl}/processUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url
      })
    });
    
    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    
    const data = await response.text();
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      console.log('Response data:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, just output text
      console.log('Response text:', data);
    }
    
    console.log('\nResponse headers:');
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });
    
  } catch (error) {
    console.error('\nError making API request:', error.message);
  }
}

// Run the test
testApiEndpoint().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 