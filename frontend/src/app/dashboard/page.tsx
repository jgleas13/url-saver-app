'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Temporary mock data for development
const mockUrls = [
  {
    id: '1',
    url: 'https://example.com/article-1',
    title: 'Example Article 1',
    summary: 'This is a summary of the first example article. It provides a brief overview of the content.',
    dateAccessed: '2024-03-28',
    tags: ['technology', 'news'],
    processingStatus: 'completed'
  },
  {
    id: '2',
    url: 'https://example.com/article-2',
    title: 'Example Article 2',
    summary: 'This is a summary of the second example article. It gives you an idea of what the article is about.',
    dateAccessed: '2024-03-27',
    tags: ['business', 'finance'],
    processingStatus: 'completed'
  },
  {
    id: '3',
    url: 'https://example.com/article-3',
    title: 'Example Article 3',
    summary: null,
    dateAccessed: '2024-03-26',
    tags: ['health', 'fitness'],
    processingStatus: 'failed'
  }
];

export default function Dashboard() {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [urls, setUrls] = useState(mockUrls);
  
  // Toggle expanded state for a URL card
  const toggleExpand = (id: string) => {
    if (expandedUrl === id) {
      setExpandedUrl(null);
    } else {
      setExpandedUrl(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/activity" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Activity
            </Link>
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter and Sort Bar Component (placeholder) */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search URLs" 
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md">
                <option value="">Filter by tag</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* URL List */}
        <div className="space-y-4">
          {urls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No URLs saved yet. Share a URL from your iPhone to get started.</p>
            </div>
          ) : (
            urls.map((urlItem) => (
              <div 
                key={urlItem.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                {/* URL Card Header - Always visible */}
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(urlItem.id)}
                >
                  <div>
                    <h3 className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      <a href={urlItem.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        {urlItem.title || urlItem.url}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{urlItem.dateAccessed}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${urlItem.processingStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {urlItem.processingStatus === 'completed' ? 'Completed' : 'Failed'}
                    </span>
                    <button>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 transition-transform ${expandedUrl === urlItem.id ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedUrl === urlItem.id && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {urlItem.summary ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary:</h4>
                        <p className="text-gray-600 dark:text-gray-400">{urlItem.summary}</p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-gray-600 dark:text-gray-400 italic">Summary unavailable</p>
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {urlItem.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 