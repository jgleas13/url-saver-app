// API base URL - This should come from environment variable in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Types
export interface UrlSubmission {
  url: string;
  title?: string;
  dateAccessed?: string;
  userId: string;
}

export interface UrlEntry {
  id: string;
  url: string;
  title: string;
  dateAccessed: string;
  summary: string | null;
  processingStatus: 'pending' | 'completed' | 'failed';
  tags: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Functions

/**
 * Submit a URL to be processed and stored
 */
export const submitUrl = async (urlData: UrlSubmission): Promise<UrlEntry> => {
  try {
    const response = await fetch(`${API_BASE_URL}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urlData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit URL');
    }

    return result.data;
  } catch (error) {
    console.error('Error submitting URL:', error);
    throw error;
  }
};

/**
 * Get all URLs for a specific user
 */
export const getUrlsByUser = async (userId: string): Promise<UrlEntry[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/urls?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch URLs');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    throw error;
  }
};

/**
 * Get a specific URL by ID
 */
export const getUrlById = async (id: string): Promise<UrlEntry> => {
  try {
    const response = await fetch(`${API_BASE_URL}/urls/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch URL');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching URL details:', error);
    throw error;
  }
}; 