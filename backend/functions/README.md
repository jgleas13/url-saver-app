# URL Saver App - Firebase Cloud Functions

This directory contains the Firebase Cloud Functions for the URL Saver app. These functions provide automatic URL summarization using Grok AI.

## Functions

### processUrl

Triggered when a new URL is added to Firestore. This function:

1. Detects when a new URL document is created in Firestore
2. Fetches the content of the URL
3. Uses Grok AI to generate a summary and tags
4. Updates the Firestore document with the summary, tags, and processing status

## Environment Setup

The function requires a Grok API key for summarization. You need to set this up in one of two ways:

1. Create a `.env` file in this directory with:
   ```
   GROK_API_KEY=your-grok-api-key
   ```

2. Or set it in Firebase Functions config:
   ```
   firebase functions:config:set grok.api_key="your-grok-api-key"
   ```

## Deployment

To deploy these functions, you need to:

1. Make sure you're using the Firebase Blaze (pay-as-you-go) plan
2. Install dependencies: `npm install`
3. Deploy the functions: `npm run deploy`

## Local Testing

To test these functions locally:

1. Install dependencies: `npm install`
2. Start the Firebase emulator: `npm run serve`

## Note

The free Firebase Spark plan does not support outbound network requests from Cloud Functions, which are required for URL fetching and API calls. You need to upgrade to the Blaze plan to use these functions. 