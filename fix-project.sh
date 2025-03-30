#!/bin/bash

echo "🔧 Starting project fix script..."

# Function to check if a process is running on a port
check_port() {
    lsof -i ":$1" > /dev/null 2>&1
}

# Function to kill process on a port
kill_port() {
    echo "Killing process on port $1..."
    lsof -ti ":$1" | xargs kill -9 2>/dev/null || true
}

# Kill any existing node processes
echo "🔄 Cleaning up existing processes..."
pkill -f node || true
pkill -f nodemon || true

# Kill processes on specific ports
kill_port 3000
kill_port 3001

echo "🔧 Setting up backend..."
cd backend

# Clean backend
rm -rf node_modules package-lock.json
npm install
npm install express cors firebase-admin dotenv @supabase/supabase-js

# Create/update .env file
cat > .env << EOL
PORT=3001
# Using mock database for testing
# FIREBASE_SERVICE_ACCOUNT=your-service-account.json
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
GROK_API_KEY=your-grok-api-key
EOL

echo "✅ Backend setup complete"

echo "🔧 Setting up frontend..."
cd ../frontend

# Clean frontend
rm -rf node_modules package-lock.json .next
npm install

echo "✅ Frontend setup complete"

echo "🚀 Starting services..."

# Start backend in background
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "🎉 Setup complete! Services are starting..."
echo "Backend running on http://localhost:3001"
echo "Frontend running on http://localhost:3000"
echo ""
echo "To stop the services, run: kill $BACKEND_PID $FRONTEND_PID"

# Make the script wait for user input before exiting
read -p "Press Enter to stop all services..."
kill $BACKEND_PID $FRONTEND_PID
echo "Services stopped" 