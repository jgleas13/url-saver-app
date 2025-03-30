# URL Saver App

A web application that allows you to save URLs from your iPhone and view them later on a website. The app generates AI summaries of the content and organizes links by tags and dates.

## Features

- Save URLs directly from your iPhone using iOS Shortcuts
- Automatic AI summarization of webpage content using Grok
- Modern dashboard to view all saved URLs
- Filter and sort URLs by tags, date, and content type
- Google authentication via Firebase

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **AI Summarization**: Grok API
- **Deployment**: Vercel, GitHub Actions

## Development Setup

### Prerequisites

- Node.js (v20 or later)
- npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/jgleas13/url-saver-app.git
   cd url-saver-app
   ```

2. Install dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the frontend directory with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

### Manual Deployment

1. Build the application
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Firebase
   ```bash
   firebase use url-saver-app-123
   firebase deploy --only hosting
   ```

### Automated Deployment with GitHub Actions

The repository is configured with GitHub Actions to automatically deploy to Firebase Hosting when changes are pushed to the main branch.

To set up automated deployment:

1. Generate a Firebase Service Account key from the Firebase Console
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the key securely

2. Add the service account key as a GitHub repository secret
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add a new repository secret named `FIREBASE_SERVICE_ACCOUNT_URL_SAVER_APP_123`
   - Paste the entire content of the service account JSON file

3. Push changes to the main branch to trigger deployment
   ```bash
   git push origin main
   ```

## iOS Shortcut Setup

1. Create a new iOS Shortcut on your iPhone
2. Add a "Get Current URL" action
3. Add a "Get Contents of URL" action with:
   - Method: POST
   - URL: your-firebase-function-url
   - Headers: Content-Type: application/json
   - Request Body: JSON with the URL, title, and current date

## License

MIT 