# URL Saver App with Grok AI Summarization

A modern web application to save, organize, and automatically summarize URLs using Grok AI.

## Features

- Save and organize URLs from around the web
- Automatic AI-powered summarization of web content using Grok AI
- Tag generation for easy content categorization
- User authentication and personalized URL collections
- Responsive design that works on desktop and mobile

## Project Structure

This project consists of two main parts:

- **Frontend**: A Next.js application with Firebase Authentication and Firestore
- **Firebase Cloud Functions**: For processing saved URLs and generating summaries with Grok AI

## Setup

### Prerequisites

- Node.js 18+
- Firebase account with Blaze plan (for Cloud Functions with external API calls)
- Grok AI API key

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```
   npm run dev
   ```

### Cloud Functions Setup

1. Navigate to the backend/functions directory:
   ```
   cd backend/functions
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Grok AI API key:
   ```
   GROK_API_KEY=your-grok-api-key
   ```

4. Deploy the functions to Firebase:
   ```
   npm run deploy
   ```

## How It Works

1. Users save URLs through the web interface
2. A Firestore trigger automatically processes new URLs
3. The Cloud Function fetches the URL content
4. Grok AI generates a summary and relevant tags
5. The summary and tags are saved back to Firestore
6. Real-time updates reflect the summarization status in the UI

## Firebase Requirements

This project requires the Firebase Blaze (pay-as-you-go) plan because:

1. Cloud Functions need to make external API calls (to fetch URLs and call the Grok API)
2. The free Spark plan does not allow outbound network requests from Cloud Functions

The actual usage costs should be minimal for personal use.

## License

MIT 