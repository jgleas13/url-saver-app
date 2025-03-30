'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUrls, UrlData, saveUrl } from '@/services/api';
import { auth } from '@/config/firebaseClient';
import LinkCard from '@/components/LinkCard/LinkCard';
import FilterSortBar from '@/components/FilterSortBar/FilterSortBar';
import AddUrlModal from '@/components/AddUrlModal/AddUrlModal';

export default function DashboardPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Function to fetch URLs
  const fetchUserUrls = async () => {
    try {
      setLoading(true);
      const urlsData = await fetchUrls();
      setUrls(urlsData);
      setFilteredUrls(urlsData);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Failed to load your saved URLs. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };
  
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
          
          fetchUserUrls();
        });
        
        // Clean up the listener on unmount
        return () => unsubscribe();
      } catch (err) {
        console.error('Error in dashboard initialization:', err);
        setError('Failed to load your saved URLs. Please try refreshing the page.');
        setLoading(false);
      }
    };
    
    checkAuthAndFetchUrls();
  }, [router]);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
      alert('Failed to sign out. Please try again.');
    }
  };

  // Handle opening modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle URL added event
  const handleUrlAdded = () => {
    fetchUserUrls();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Your Saved URLs</h1>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/activity" 
              className="text-gray-600 hover:text-gray-900"
            >
              Activity
            </a>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
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
            {/* Top action bar with filter and add button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <FilterSortBar urls={urls} onFilterChange={setFilteredUrls} />
              
              <button
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add URL Manually
              </button>
            </div>
            
            {/* URL List */}
            {filteredUrls.length > 0 ? (
              <div className="space-y-4">
                {filteredUrls.map((url) => (
                  <LinkCard key={url.id} urlData={url} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {urls.length > 0 
                    ? 'No URLs match your current filters'
                    : 'No saved URLs yet. Add your first URL!'}
                </p>
                {urls.length === 0 && (
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add URL Manually
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Add URL Modal */}
      <AddUrlModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUrlAdded={handleUrlAdded}
      />
    </div>
  );
} 