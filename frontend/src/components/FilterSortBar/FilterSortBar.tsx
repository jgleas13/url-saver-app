'use client';

import { useState, useEffect } from 'react';
import { UrlData } from '@/services/api';

type SortBy = 'date-new' | 'date-old' | 'title';

interface FilterSortBarProps {
  urls: UrlData[];
  onFilterChange: (filteredUrls: UrlData[]) => void;
}

export default function FilterSortBar({ urls, onFilterChange }: FilterSortBarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date-new');
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Extract all unique tags from URLs
  useEffect(() => {
    if (urls.length) {
      const tagsSet = new Set<string>();
      urls.forEach(url => {
        url.tags.forEach(tag => tagsSet.add(tag));
      });
      setAllTags(Array.from(tagsSet).sort());
    }
  }, [urls]);
  
  // Filter and sort URLs whenever filters or sort option changes
  useEffect(() => {
    let filteredResults = [...urls];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredResults = filteredResults.filter(
        url => url.pageTitle.toLowerCase().includes(term) || 
               url.url.toLowerCase().includes(term) ||
               (url.summary && url.summary.toLowerCase().includes(term))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filteredResults = filteredResults.filter(url => 
        selectedTags.some(tag => url.tags.includes(tag))
      );
    }
    
    // Sort results
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'date-new':
          return new Date(b.dateAccessed).getTime() - new Date(a.dateAccessed).getTime();
        case 'date-old':
          return new Date(a.dateAccessed).getTime() - new Date(b.dateAccessed).getTime();
        case 'title':
          return a.pageTitle.localeCompare(b.pageTitle);
        default:
          return 0;
      }
    });
    
    onFilterChange(filteredResults);
  }, [searchTerm, selectedTags, sortBy, urls, onFilterChange]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or content..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center mb-4">
        <span className="text-gray-700 mr-2 font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-new">Newest First</option>
          <option value="date-old">Oldest First</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
      
      {allTags.length > 0 && (
        <div>
          <span className="text-gray-700 mr-2 font-medium block mb-2">Filter by tags:</span>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 