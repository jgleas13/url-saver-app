'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUrls, UrlData } from '@/services/api';
import { auth } from '@/config/firebaseClient';

export default function ActivityPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check authentication and fetch URLs
  useEffect(() => {
    const checkAuthAndFetchUrls = async () => {
      try {
        // Check if user is authenticated
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            // Redirect to login if not authenticated
            router.push('/auth/login');
            return;
          }
          
          try {
            // Fetch URLs
            const urlsData = await fetchUrls();
            setUrls(urlsData);
          } catch (err) {
            console.error('Error fetching URLs:', err);
            setError('Failed to load your activity data. Please try refreshing the page.');
          } finally {
            setLoading(false);
          }
        });
        
        // Clean up the listener on unmount
        return () => unsubscribe();
      } catch (err) {
        console.error('Error in activity page initialization:', err);
        setError('Failed to load your activity. Please try refreshing the page.');
        setLoading(false);
      }
    };
    
    checkAuthAndFetchUrls();
  }, [router]);
  
  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      completed: 0,
      failed: 0,
      total: urls.length
    };
    
    urls.forEach(url => {
      if (url.processingStatus === 'completed') {
        counts.completed++;
      } else {
        counts.failed++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Status Summary */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Status Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total URLs</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-600">Successfully Processed</p>
                  <p className="text-2xl font-bold text-green-700">{statusCounts.completed}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-md">
                  <p className="text-sm text-amber-600">Processing Failed</p>
                  <p className="text-2xl font-bold text-amber-700">{statusCounts.failed}</p>
                </div>
              </div>
            </div>
            
            {/* Activity List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Processing Activity</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details about URL processing status
                </p>
              </div>
              
              {urls.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {urls.map(url => (
                    <li key={url.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <h4 className="text-md font-medium text-blue-600 hover:underline truncate">
                            <a href={url.url} target="_blank" rel="noopener noreferrer">
                              {url.pageTitle}
                            </a>
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            {url.url}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            url.processingStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {url.processingStatus === 'completed' ? 'Completed' : 'Failed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {url.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No activity yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 