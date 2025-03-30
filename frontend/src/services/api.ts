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
  // Get the current user's token for authentication
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;
  
  try {
    const response = await fetch(`${API_URL}/urls`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if we have a token
        ...(token && {
          'Authorization': `Bearer ${token}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    throw error;
  }
};

/**
 * Save a URL to the API
 * @param urlData URL data to save
 * @returns Promise<UrlData>
 */
export const saveUrl = async (urlData: {
  url: string;
  pageTitle?: string;
  dateAccessed?: string;
}): Promise<UrlData> => {
  // Get the current user's token for authentication
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  try {
    const response = await fetch(`${API_URL}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if we have a token
        ...(token && {
          'Authorization': `Bearer ${token}`
        })
      },
      body: JSON.stringify(urlData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving URL:', error);
    throw error;
  }
}; 