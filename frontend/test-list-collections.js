// Firebase Firestore Collection Explorer Script

// Load environment variables
require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  getDocs,
  query,
  orderBy
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Command-line arguments
const email = process.argv[2]; // email for authentication
const password = process.argv[3]; // password for authentication

// List URL documents
async function listUrls(userId) {
  try {
    console.log(`Listing URLs for user: ${userId}`);
    console.log('Collection path: users/' + userId + '/urls');

    const urlsQuery = query(
      collection(db, 'users', userId, 'urls'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(urlsQuery);
    console.log(`Found ${querySnapshot.docs.length} documents`);

    // Print each document
    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\nDocument ${index + 1}:`);
      console.log(`ID: ${doc.id}`);
      console.log(`URL: ${data.url}`);
      console.log(`Title: ${data.pageTitle || 'N/A'}`);
      console.log(`Status: ${data.processingStatus || 'N/A'}`);
      console.log(`Tags: ${(data.tags || []).join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing documents:', error);
  }
}

// Main function
async function main() {
  try {
    if (!email || !password) {
      console.error('Email and password are required for authentication');
      return;
    }
    
    // Authenticate user
    console.log(`Authenticating user: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User authenticated:', user.uid);
    
    await listUrls(user.uid);
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main(); 