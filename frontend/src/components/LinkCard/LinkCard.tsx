'use client';

import { useState } from 'react';
import { UrlData } from '@/services/api';

interface LinkCardProps {
  urlData: UrlData;
}

export default function LinkCard({ urlData }: LinkCardProps) {
  const [expanded, setExpanded] = useState(false);

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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 hover:shadow-lg transition-shadow">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-blue-600 hover:underline truncate">
            <a 
              href={urlData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {urlData.pageTitle}
            </a>
          </h3>
          <span className="text-sm text-gray-500">
            {formatDate(urlData.dateAccessed)}
          </span>
        </div>
        
        {expanded && (
          <div className="mt-4 text-gray-700">
            <div className="text-sm text-gray-500 mb-2">
              {urlData.url}
            </div>
            
            {urlData.summary ? (
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <h4 className="font-medium mb-1">Summary:</h4>
                <p>{urlData.summary}</p>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded-md mb-3">
                <p className="text-red-600">
                  Summary unavailable
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {urlData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              
              <span 
                className={`px-2 py-1 rounded-full text-xs ml-auto ${
                  urlData.processingStatus === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {urlData.processingStatus === 'completed' ? 'Completed' : 'Failed'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 