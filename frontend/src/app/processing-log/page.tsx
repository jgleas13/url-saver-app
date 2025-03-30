'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUrls, UrlData } from '@/services/api';
import { auth } from '@/config/firebaseClient';
import Navbar from '@/components/Navbar/Navbar';

export default function ProcessingLogPage() {
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
            setError('Failed to load your processing log. Please try refreshing the page.');
          } finally {
            setLoading(false);
          }
        });
        
        // Clean up the listener on unmount
        return () => unsubscribe();
      } catch (err) {
        console.error('Error in processing log page initialization:', err);
        setError('Failed to load your processing log. Please try refreshing the page.');
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
      pending: 0,
      processing: 0,
      total: urls.length
    };
    
    urls.forEach(url => {
      if (url.processingStatus === 'completed') {
        counts.completed++;
      } else if (url.processingStatus === 'pending') {
        counts.pending++;
      } else if (url.processingStatus === 'processing') {
        counts.processing++;
      } else {
        counts.failed++;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Processing Log</h1>
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
          <>
            {/* Status Summary */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Status Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Total Links</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-600">Successfully Processed</p>
                  <p className="text-2xl font-bold text-green-700">{statusCounts.completed}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-600">Pending/Processing</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {(statusCounts.pending || 0) + (statusCounts.processing || 0)}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-sm text-red-600">Processing Failed</p>
                  <p className="text-2xl font-bold text-red-700">{statusCounts.failed}</p>
                </div>
              </div>
            </div>
            
            {/* Processing Log Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Processing Activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Details about link processing status
                </p>
              </div>
              
              {urls.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Added
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {urls.map(url => (
                        <tr key={url.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-blue-600 hover:underline">
                                <a href={url.url} target="_blank" rel="noopener noreferrer">
                                  {url.aiGeneratedTitle || url.pageTitle}
                                </a>
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {url.url}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              url.processingStatus === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : url.processingStatus === 'pending'
                                  ? 'bg-blue-100 text-blue-800'
                                  : url.processingStatus === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                              {url.processingStatus === 'completed' 
                                ? 'Completed' 
                                : url.processingStatus === 'pending'
                                  ? 'Pending'
                                  : url.processingStatus === 'processing'
                                    ? 'Processing...'
                                    : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(url.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No processing activity yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 