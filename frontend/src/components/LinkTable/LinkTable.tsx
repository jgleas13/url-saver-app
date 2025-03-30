'use client';

import React, { useState } from 'react';
import { UrlData } from '@/services/api';

interface LinkTableProps {
  urls: UrlData[];
}

export default function LinkTable({ urls }: LinkTableProps) {
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
              </tr>
              {expandedRow === url.id && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4">
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