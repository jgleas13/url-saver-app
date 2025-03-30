const fetch = require('node-fetch');

/**
 * This script simulates an iOS Shortcut sending a URL to your backend.
 */
async function testUrlSubmission() {
  const API_URL = 'http://localhost:3001/api/v1/urls';
  
  const urlData = {
    url: 'https://developer.mozilla.org/en-US/',
    pageTitle: 'MDN Web Docs',
    dateAccessed: new Date().toISOString()
  };
  
  try {
    console.log('Sending test URL to API...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urlData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success! URL saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving URL:', error);
    throw error;
  }
}

// Run the test
testUrlSubmission()
  .then(() => console.log('Test completed successfully'))
  .catch((error) => console.error('Test failed:', error))
  .finally(() => process.exit()); 