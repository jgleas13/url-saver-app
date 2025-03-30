// Firebase Firestore direct access test script
// This script directly tests document deletion

// Load environment variables
require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');

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
const command = process.argv[2]; // 'get' or 'delete'
const documentId = process.argv[3]; // document ID to operate on
const email = process.argv[4]; // email for authentication
const password = process.argv[5]; // password for authentication

// Test reading a document
async function getDocument(userId, docId) {
  try {
    console.log(`Attempting to read document: users/${userId}/urls/${docId}`);
    const docRef = doc(db, 'users', userId, 'urls', docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Document found:', docSnap.data());
      return true;
    } else {
      console.log('Document not found!');
      return false;
    }
  } catch (error) {
    console.error('Error reading document:', error);
    return false;
  }
}

// Test deleting a document
async function deleteDocument(userId, docId) {
  try {
    console.log(`Attempting to delete document: users/${userId}/urls/${docId}`);
    
    // First check if document exists
    const exists = await getDocument(userId, docId);
    if (!exists) {
      console.log('Cannot delete - document does not exist');
      return false;
    }
    
    // Then delete it
    const docRef = doc(db, 'users', userId, 'urls', docId);
    await deleteDoc(docRef);
    console.log('Document successfully deleted!');
    
    // Verify deletion
    const verifyExists = await getDocument(userId, docId);
    if (!verifyExists) {
      console.log('Verified: Document is no longer in Firestore');
      return true;
    } else {
      console.log('ERROR: Document still exists after deletion!');
      return false;
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
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
    
    if (command === 'get' && documentId) {
      await getDocument(user.uid, documentId);
    } else if (command === 'delete' && documentId) {
      await deleteDocument(user.uid, documentId);
    } else {
      console.log('Invalid command. Use: node test-delete.js [get|delete] [documentId] [email] [password]');
    }
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main();
