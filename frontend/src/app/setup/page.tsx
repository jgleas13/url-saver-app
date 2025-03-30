'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebaseClient';
import Navbar from '@/components/Navbar/Navbar';
import { v4 as uuidv4 } from 'uuid';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    uid: string;
  } | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Set the base URL based on the current environment
    if (typeof window !== 'undefined') {
      // Check if we're on the production domain
      if (window.location.hostname.includes('url-saver-app-123.web.app')) {
        setBaseUrl('https://us-central1-url-saver-app-123.cloudfunctions.net');
      } else {
        // For local development
        setBaseUrl('http://localhost:5001/url-saver-app-123/us-central1');
      }
    }
  }, []);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (!currentUser) {
            // Redirect to login if not authenticated
            router.push('/auth/login');
            return;
          }
          
          setUser({
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid
          });
          
          // Generate or retrieve API key for the user
          // In a real app, we would store and retrieve this from the database
          // For now, we'll use a generated UUID based on the user's UID for demo purposes
          // We use the user ID to ensure the generated key is consistent for the same user
          const userSpecificApiKey = `${uuidv4().replace(/-/g, '')}_${currentUser.uid.substring(0, 6)}`;
          setApiKey(userSpecificApiKey);
          setLoading(false);
        });
        
        // Clean up the listener on unmount
        return () => unsubscribe();
      } catch (err) {
        console.error('Error in setup page initialization:', err);
        setError('Failed to load setup information. Please try refreshing the page.');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiEndpoint = `${baseUrl}/processUrlHttp`;

  const shortcutInstructions = [
    'Open the Shortcuts app on your iPhone',
    'Tap the + icon to create a new shortcut',
    'Tap "Add Action"',
    'Search for "URL" and select "URL" action',
    'Enter the URL you want to save',
    'Tap "+" and search for "Get Contents of URL"',
    'Tap "Show More" in the Get Contents action',
    'Set Method to POST',
    'Add a new header with Key "Authorization" and Value "Bearer YOUR_API_KEY"',
    'Add Request Body as JSON with a key of "url" and the Shortcut Input as value',
    'Name your shortcut (e.g., "Save to Knowledge Base")',
    'Add it to your share sheet for easy access'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Setup Instructions</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your API Key</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Use this key to authenticate your iOS Shortcut requests
                </p>
              </div>
              <div className="p-6">
                {user && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      Hello, <strong>{user.displayName || user.email?.split('@')[0] || 'User'}</strong>! This is your personal API key for setting up the Knowledge Base iOS shortcut.
                    </p>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="flex-grow bg-gray-100 p-3 rounded-md font-mono text-sm overflow-auto">
                    {apiKey}
                  </div>
                  <button
                    onClick={copyApiKey}
                    className="ml-3 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important security information</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Keep this API key secret. It allows adding content to your account. If you need to reset it, please contact support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">API Endpoint</h2>
                <p className="mt-1 text-sm text-gray-500">
                  This is the URL your shortcut will call
                </p>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-auto">
                  {apiEndpoint}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">iOS Shortcut Setup</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Follow these steps to set up the shortcut on your iPhone
                </p>
              </div>
              <div className="p-6">
                <ol className="list-decimal pl-5 space-y-4">
                  {shortcutInstructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Example Shortcut JSON Configuration</h3>
                  <pre className="bg-white p-3 rounded-md text-xs overflow-auto">
{`{
  "url": "Shortcut Input"
}`}
                  </pre>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Final Configuration Review</h3>
                  <p className="text-gray-700 mb-4">
                    Your shortcut should send a POST request to the API endpoint with your API key in the Authorization header and the URL in the request body.
                  </p>
                  <p className="text-gray-700">
                    After setting up, you can share any webpage to your shortcut, and it will be automatically saved to your Knowledge Base with AI-generated summaries and tags.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 