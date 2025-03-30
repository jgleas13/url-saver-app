import { auth } from '@/config/firebaseClient';

// Types
export interface UrlData {
  id: string;
  url: string;
  pageTitle: string;
  dateAccessed: string;
  summary: string | null;
  tags: string[];
  processingStatus: 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Fetch all saved URLs from the API
 * @returns Promise<UrlData[]>
 */
export const fetchUrls = async (): Promise<UrlData[]> => {
  // For testing, return mock data
  return [
    {
      id: '1',
      url: 'https://example.com',
      pageTitle: 'Example Website',
      dateAccessed: new Date().toISOString(),
      summary: 'This is a mock summary for testing purposes.',
      tags: ['test', 'example', 'mock'],
      processingStatus: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}; 