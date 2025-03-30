const fetch = require('node-fetch');

// Get command line arguments
const apiKey = process.argv[2];
const url = process.argv[3] || 'https://example.com';
const apiBaseUrl = process.argv[4] || 'https://us-central1-url-saver-app-123.cloudfunctions.net';

if (!apiKey) {
  console.error('Error: API key is required');
  console.log('Usage: node test-auth-formats.js <api_key> [url] [api_base_url]');
  process.exit(1);
}

// Function to make a test request with a specific auth format
async function testWithAuthFormat(format, authValue) {
  console.log(`\n=== Testing with auth format: ${format} ===`);
  
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add the authorization header with the specified format
    headers['Authorization'] = authValue;
    
    console.log(`Request Headers:`, headers);
    console.log(`URL: ${apiBaseUrl}/processUrl`);
    
    const response = await fetch(`${apiBaseUrl}/processUrl`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        url: url
      })
    });
    
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    const data = await response.text();
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      console.log('Response data:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, just output text
      console.log('Response text:', data);
    }
    
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

// Main function to run all tests
async function runAllTests() {
  console.log(`\n=== API Authorization Format Tests ===`);
  console.log(`API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Testing with URL: ${url}`);
  
  // Test different authorization header formats
  await testWithAuthFormat('Bearer with space', `Bearer ${apiKey}`);
  await testWithAuthFormat('Bearer without space', `Bearer${apiKey}`);
  await testWithAuthFormat('Just the key', apiKey);
  await testWithAuthFormat('Token prefix', `Token ${apiKey}`);
  await testWithAuthFormat('Basic prefix', `Basic ${apiKey}`);
  await testWithAuthFormat('x-api-key header', `x-api-key: ${apiKey}`);
  
  console.log('\n=== All tests completed ===');
}

// Run all tests
runAllTests().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 