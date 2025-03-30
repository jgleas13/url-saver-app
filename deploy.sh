#!/bin/bash

# URL Saver App Deployment Script
echo "🚀 Starting URL Saver App deployment"

# Ensure we have the Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Ensure the user is logged in
echo "📝 Checking Firebase login status..."
firebase login

# Deploy the Cloud Functions
echo "⚙️ Deploying Cloud Functions..."
cd backend/functions
npm install
npm run deploy

# Return to the root directory
cd ../..

# Build and deploy the frontend
echo "🖥️ Building and deploying the frontend..."
cd frontend
npm install
npm run build
firebase deploy --only hosting

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should now be live on Firebase Hosting" 