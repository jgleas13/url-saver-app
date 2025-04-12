'use client';

import React from 'react';
import { TagFilter } from '../../types/tags';

interface FilterSortBarProps {
  onTagFilterChange: (filter: TagFilter) => void;
  selectedTagFilter: TagFilter;
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  onTagFilterChange,
  selectedTagFilter,
}) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <select
        value={selectedTagFilter}
        onChange={(e) => onTagFilterChange(e.target.value as TagFilter)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Tags</option>
        <option value="tagged">Tagged Only</option>
        <option value="untagged">Untagged Only</option>
      </select>
    </div>
  );
}; 