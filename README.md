# iPhone URL Sharing & AI Summarization App

A modern web application that allows users to save and organize URLs shared from their iPhones. The app automatically summarizes webpage content using Grok AI, adds tags, and provides an organized dashboard for easy retrieval.

## Features

- Share URLs directly from your iPhone using iOS Shortcuts
- Automatic AI-powered summarization of webpage content
- Tag-based organization for easy filtering
- Modern, clean dashboard interface
- Google authentication via Firebase
- Activity tracking for all processed URLs

## Project Structure

This project consists of two main parts:

1. **Frontend**: A Next.js 14 web application with TypeScript and Tailwind CSS
2. **Backend**: A Node.js Express API that processes URLs and interacts with Firebase

## Setup Instructions

### Prerequisites

- Node.js LTS version (20.x or later)
- Firebase account for authentication and database
- Grok AI API access (for production use)

### Environment Setup

1. Clone the repository and install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Configure environment variables:

For the backend, create a `.env` file in the `backend` directory:

```
PORT=3001
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...} # Your service account key JSON as a string
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
GROK_API_KEY=your-grok-api-key
```

For the frontend, create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Firebase Setup

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication in the Authentication section
3. Set up Firestore Database and create a collection named `urls`
4. Generate a service account key from Project Settings > Service Accounts
5. Configure security rules for Firestore to restrict access to authenticated users

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Visit `http://localhost:3000` in your browser to access the application

## iOS Shortcut Setup

1. Create a new iOS Shortcut in the Shortcuts app
2. Add an action to get the current webpage URL
3. Add an HTTP Request action with the following configuration:
   - Method: POST
   - URL: Your backend API URL (e.g., https://your-deployed-app.com/api/v1/urls)
   - Headers: Content-Type: application/json
   - Request Body (JSON):
     ```json
     {
       "url": "{{URL}}",
       "pageTitle": "{{Page Title}}",
       "dateAccessed": "{{Current Date}}"
     }
     ```
4. Add a notification to show a success message
5. Save and share the shortcut to your home screen

## Deployment

The application can be deployed using Vercel for both the frontend and backend:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy both the backend and frontend

## License

This project is licensed under the MIT License. 