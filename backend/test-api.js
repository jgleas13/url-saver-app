const fetch = require('node-fetch');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test function to make a request to the API
async function testApiEndpoint(apiKey, apiBaseUrl, url) {
  console.log(`Testing API endpoint...`);
  console.log(`API Base URL: ${apiBaseUrl}`);
  console.log(`Testing with URL: ${url}`);
  
  try {
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
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const data = await response.text();
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      console.log('Response data:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, just output text
      console.log('Response text:', data);
    }
    
    console.log('\nFull response headers:');
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });
    
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

// Main function to run the test
function runTest() {
  rl.question('Enter your API key: ', (apiKey) => {
    rl.question('Enter the API base URL (default: https://us-central1-url-saver-app-123.cloudfunctions.net): ', (baseUrl) => {
      const apiBaseUrl = baseUrl || 'https://us-central1-url-saver-app-123.cloudfunctions.net';
      
      rl.question('Enter a URL to process (default: https://example.com): ', (url) => {
        const testUrl = url || 'https://example.com';
        
        testApiEndpoint(apiKey, apiBaseUrl, testUrl)
          .finally(() => {
            rl.close();
          });
      });
    });
  });
}

// Start the test
console.log('=== API Endpoint Test Tool ===');
runTest(); 