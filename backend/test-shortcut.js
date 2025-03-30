/**
 * This script simulates an iOS Shortcut sending a URL to your backend.
 */
const fetch = require('node-fetch');

// Configuration
const API_KEY = "c9de360ac0bd4bb89b6e539de9c4845c_drHUbP"; // Replace with your own API key
const TEST_URL = "https://example.com";
const API_ENDPOINT = "https://us-central1-url-saver-app-123.cloudfunctions.net/processUrlHttp";

async function testIosShortcut() {
  console.log("\n=== iOS Shortcut Simulation ===");
  console.log(`Sending URL: ${TEST_URL}`);
  console.log(`To endpoint: ${API_ENDPOINT}`);
  console.log(`Using API key: ${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`);

  try {
    // Prepare the request (simulates what an iOS shortcut would send)
    const requestBody = {
      url: TEST_URL
    };

    // Make the API request
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` 
      },
      body: JSON.stringify(requestBody)
    });

    // Log response data
    console.log(`\nResponse status: ${response.status} ${response.statusText}`);
    
    const responseData = await response.text();
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(responseData);
      console.log('Response data:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      // If not JSON, output as text
      console.log('Response text:', responseData);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testIosShortcut()
  .then(() => console.log('\nTest completed.'))
  .catch(err => console.error('Unexpected error:', err)); 