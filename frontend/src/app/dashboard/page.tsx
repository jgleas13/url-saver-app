'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUrls, deleteUrl, UrlData } from '@/services/api';
import { auth } from '@/config/firebaseClient';
import { FilterSortBar } from '@/components/FilterSortBar/FilterSortBar';
import { TagFilter } from '@/types/tags';
import AddUrlModal from '@/components/AddUrlModal/AddUrlModal';
import Navbar from '@/components/Navbar/Navbar';
import LinkTable from '@/components/LinkTable/LinkTable';
import AddUrlButton from '@/components/AddUrlButton/AddUrlButton';

export default function DashboardPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<TagFilter>('all');

  // Function to fetch URLs
  const fetchUserUrls = async () => {
    try {
      setLoading(true);
      const urlsData = await fetchUrls();
      setUrls(urlsData);
      applyTagFilter(urlsData, selectedTagFilter);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Failed to load your saved links. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Function to apply tag filter
  const applyTagFilter = (urlsToFilter: UrlData[], filter: TagFilter) => {
    let filtered = urlsToFilter;
    if (filter === 'tagged') {
      filtered = urlsToFilter.filter(url => url.tags && url.tags.length > 0);
    } else if (filter === 'untagged') {
      filtered = urlsToFilter.filter(url => !url.tags || url.tags.length === 0);
    }
    setFilteredUrls(filtered);
  };

  // Handle tag filter change
  const handleTagFilterChange = (filter: TagFilter) => {
    setSelectedTagFilter(filter);
    applyTagFilter(urls, filter);
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
        setError('Failed to load your saved links. Please try refreshing the page.');
        setLoading(false);
      }
    };
    
    checkAuthAndFetchUrls();
  }, [router]);

  // Handle opening modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle URL added event
  const handleUrlAdded = () => {
    fetchUserUrls();
  };
  
  // Handle URL deletion
  const handleUrlDelete = async (urlId: string) => {
    try {
      setIsDeleting(true);
      console.log('Starting delete operation for URL ID:', urlId);
      await deleteUrl(urlId);
      console.log('Delete operation completed successfully');
      
      // Update the UI after successful deletion
      setUrls(urls.filter(url => url.id !== urlId));
      setFilteredUrls(filteredUrls.filter(url => url.id !== urlId));
    } catch (err: unknown) {
      console.error('Error deleting URL:', err);
      // Show a more detailed error message
      let errorMessage = 'Unknown error';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Failed to delete URL: ${errorMessage}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Links</h1>
          <div className="mt-4 md:mt-0">
            <AddUrlButton onClick={openAddModal} />
          </div>
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
            {/* Filter and search section */}
            <div className="mb-6">
              <FilterSortBar
                onTagFilterChange={handleTagFilterChange}
                selectedTagFilter={selectedTagFilter}
              />
            </div>
            
            {/* URL Table */}
            {filteredUrls.length > 0 ? (
              <div className="relative">
                {isDeleting && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                <LinkTable 
                  urls={filteredUrls} 
                  onDelete={handleUrlDelete} 
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg mb-4">
                  {urls.length > 0 
                    ? 'No links match your current filters'
                    : 'No saved links yet. Add your first link!'}
                </p>
                {urls.length === 0 && (
                  <AddUrlButton onClick={openAddModal} />
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