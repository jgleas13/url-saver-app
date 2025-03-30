'use client';

import React, { useState } from 'react';
import { UrlData } from '@/services/api';

interface LinkTableProps {
  urls: UrlData[];
  onDelete: (urlId: string) => void;
}

export default function LinkTable({ urls, onDelete }: LinkTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleRow = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row expansion
    console.log('Delete button clicked for URL ID:', id);
    
    if (confirm('Are you sure you want to delete this URL?')) {
      console.log('Deletion confirmed for URL ID:', id);
      onDelete(id);
    } else {
      console.log('Deletion canceled by user');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Added
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tags
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="w-10"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {urls.map((url) => (
            <React.Fragment key={url.id}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(url.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600 hover:underline">
                    <a 
                      href={url.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {url.aiGeneratedTitle || url.pageTitle}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(url.dateAccessed)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {url.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {url.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{url.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      url.processingStatus === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : url.processingStatus === 'pending'
                          ? 'bg-blue-100 text-blue-800'
                          : url.processingStatus === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {url.processingStatus === 'completed' 
                      ? 'Completed' 
                      : url.processingStatus === 'pending'
                        ? 'Pending'
                        : url.processingStatus === 'processing'
                          ? 'Processing...'
                          : 'Failed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
                    onClick={(e) => handleDelete(e, url.id)}
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
              {expandedRow === url.id && (
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-6 py-4">
                    <div className="text-sm text-gray-700 space-y-3">
                      <div className="text-sm text-gray-500">
                        {url.url}
                      </div>
                      
                      {/* Display original page title if AI title is shown in the header */}
                      {url.aiGeneratedTitle && url.aiGeneratedTitle !== url.pageTitle && (
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Original Title:</span> {url.pageTitle}
                        </div>
                      )}
                      
                      {url.summary ? (
                        <div className="bg-gray-100 p-3 rounded-md">
                          <h4 className="font-medium mb-1">Summary:</h4>
                          {url.processingStatus === 'pending' || url.processingStatus === 'processing' ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                              <p className="text-gray-500 italic">
                                {url.processingStatus === 'processing' 
                                  ? 'Generating summary using AI...'
                                  : 'Waiting to process...'}
                              </p>
                            </div>
                          ) : (
                            <p>{url.summary}</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-red-600">
                            Summary unavailable
                          </p>
                        </div>
                      )}
                      
                      {url.tags.length > 3 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="font-medium text-sm">All tags:</span>
                          {url.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 