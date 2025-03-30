const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Import routes
const urlsRoutes = require('./routes/urls');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true }));  // Allow requests from any origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  // Skip auth in development if no Firebase credentials are available
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn('Firebase credentials not found. Skipping authentication check.');
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Routes
app.use('/api/v1/urls', authenticateUser, urlsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export the API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);

// If running locally without Firebase
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 