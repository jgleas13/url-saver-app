/**
 * Service for database operations using Firebase
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase admin SDK
let firebaseInitialized = false;
try {
  // Check if environment variables are set for Firebase
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    // Initialize Firebase with service account credentials
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    firebaseInitialized = true;
  } else {
    console.warn('Firebase credentials not found in environment variables. Using mock database implementation.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.warn('Using mock database implementation...');
}

// Get Firestore instance if Firebase is initialized
const db = firebaseInitialized ? admin.firestore() : null;

// In-memory store for development when Firebase is not configured
const mockDatabase = {
  urls: []
};

/**
 * Save a URL and its metadata to the database
 * @param {Object} urlData - Data to save
 * @returns {Promise<Object>} - Saved URL data
 */
const saveUrl = async (urlData) => {
  // Generate a unique ID for the URL
  const id = Date.now().toString();
  const timestamp = new Date().toISOString();
  
  const newUrlEntry = {
    id,
    ...urlData,
    created_at: timestamp,
    updated_at: timestamp,
  };

  if (db) {
    // Use Firebase if configured
    try {
      const urlRef = db.collection('urls').doc(id);
      await urlRef.set(newUrlEntry);
      return newUrlEntry;
    } catch (error) {
      console.error('Firebase error:', error);
      throw new Error('Failed to save URL to database');
    }
  } else {
    // Use mock database if Firebase is not configured
    mockDatabase.urls.push(newUrlEntry);
    return newUrlEntry;
  }
};

/**
 * Get all saved URLs
 * @returns {Promise<Array>} - Array of URL entries
 */
const getUrls = async () => {
  if (db) {
    // Use Firebase if configured
    try {
      const snapshot = await db.collection('urls')
        .orderBy('created_at', 'desc')
        .get();
        
      const urls = [];
      snapshot.forEach(doc => {
        urls.push(doc.data());
      });
      
      return urls;
    } catch (error) {
      console.error('Firebase error:', error);
      throw new Error('Failed to retrieve URLs from database');
    }
  } else {
    // Use mock database if Firebase is not configured
    return mockDatabase.urls.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }
};

module.exports = {
  saveUrl,
  getUrls,
}; 