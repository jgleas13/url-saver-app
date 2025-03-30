// Script to check URL data in Firestore
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to find the service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;

try {
  // Check if service account key file exists
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
    console.log('Found service account key file');
  } else {
    console.error('Service account key file not found at:', serviceAccountPath);
    console.log('Please make sure the serviceAccountKey.json file exists in the backend directory');
    process.exit(1);
  }
} catch (error) {
  console.error('Error loading service account key:', error);
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const documentId = 'HjIZSPtHe2O1XU1ewqZD';
const userId = 'test_user';

async function checkUrlDocument() {
  try {
    console.log(`Checking document: users/${userId}/urls/${documentId}`);
    
    const urlDoc = await db.collection('users').doc(userId).collection('urls').doc(documentId).get();
    
    if (urlDoc.exists) {
      console.log('Document found!');
      console.log('URL data:');
      console.log(JSON.stringify(urlDoc.data(), null, 2));
    } else {
      console.log('Document not found.');
      
      // List all documents in the user's urls collection
      console.log('Listing all URLs for user:', userId);
      const urlsSnapshot = await db.collection('users').doc(userId).collection('urls').get();
      
      if (urlsSnapshot.empty) {
        console.log('No documents found in collection');
      } else {
        console.log(`Found ${urlsSnapshot.size} documents:`);
        urlsSnapshot.forEach(doc => {
          console.log(`- ${doc.id}: ${doc.data().url}`);
        });
      }
    }
  } catch (error) {
    console.error('Error checking Firestore:', error);
  } finally {
    process.exit(0);
  }
}

checkUrlDocument(); 