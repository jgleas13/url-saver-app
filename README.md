# URL Sharing & AI Summarization App

A modern web application that allows users to save and summarize web content directly from an iPhone.

## Features

- **URL Sharing from iPhone**: Share any URL via iOS Shortcut directly to the app
- **AI-Powered Summaries**: Generate concise summaries of web content using Grok AI
- **Organized Dashboard**: View all saved URLs with tags, summaries, and metadata
- **Google Authentication**: Secure sign-in via Supabase authentication
- **Activity Tracking**: Monitor processing status of shared URLs
- **Filtering & Sorting**: Organize your saved content by tags, date, and status

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with Google Sign-In
- **Deployment**: Vercel for hosting both frontend and backend
- **AI Integration**: Grok for content summarization

## Getting Started

### Prerequisites

- Node.js LTS version
- Supabase account (for database and authentication)
- Grok API key (for AI summarization)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd url-sharing-app
   ```

2. Install dependencies for both frontend and backend:
   ```
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Configure environment variables:
   
   **Frontend (.env.local)**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

   **Backend (.env)**
   ```
   PORT=3001
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   GROK_API_KEY=your-grok-api-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development servers:
   
   **Frontend**
   ```
   cd frontend
   npm run dev
   ```

   **Backend**
   ```
   cd backend
   npm run dev
   ```

5. The application should now be running at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### iOS Shortcut Setup

1. Create a new iOS Shortcut in the Shortcuts app
2. Add the "Get Current URL" action
3. Add a "Get Details of URL" action to extract the page title
4. Add a "Get Current Date" action
5. Add a "URL" action with a POST request to your backend API endpoint
6. Configure the request body to include the URL, title, and date
7. Save the shortcut and add it to your Share Sheet for easy access

## Deployment

### Frontend & Backend (Vercel)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy both frontend and backend using Vercel's serverless functions

### Database (Supabase)

1. Create a new project in Supabase
2. Set up the required database tables:
   - `urls` table with fields for URL, title, summary, processing status, etc.
3. Configure authentication to enable Google sign-in

## Project Structure

```
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # UI components
│   │   └── services/     # API services
│   └── public/           # Static files
│
└── backend/              # Node.js backend
    ├── src/
    │   ├── routes/       # API routes
    │   └── services/     # Business logic
    └── dist/             # Compiled JavaScript
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 