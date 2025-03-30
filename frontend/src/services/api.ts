import { auth, db } from '@/config/firebaseClient';
import { collection, query, getDocs, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';

// Types
export interface UrlData {
  id: string;
  url: string;
  pageTitle: string;
  aiGeneratedTitle?: string;
  dateAccessed: string;
  summary: string | null;
  tags: string[];
  processingStatus: 'completed' | 'failed' | 'pending' | 'processing';
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all saved URLs from Firestore
 * @returns Promise<UrlData[]>
 */
export const fetchUrls = async (): Promise<UrlData[]> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = currentUser.uid;
    const urlsQuery = query(
      collection(db, 'users', userId, 'urls'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(urlsQuery);
    const urlsData: UrlData[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        url: data.url,
        pageTitle: data.pageTitle || 'Untitled',
        aiGeneratedTitle: data.aiGeneratedTitle || undefined,
        dateAccessed: data.dateAccessed || new Date().toISOString(),
        summary: data.summary || null,
        tags: data.tags || ['untagged'],
        processingStatus: data.processingStatus || 'completed',
        created_at: data.created_at?.toDate().toISOString() || new Date().toISOString(),
        updated_at: data.updated_at?.toDate().toISOString() || new Date().toISOString()
      } as UrlData;
    });

    return urlsData;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    throw error;
  }
};

/**
 * Save a URL to Firestore
 * @param urlData URL data to save
 * @returns Promise<UrlData>
 */
export const saveUrl = async (urlData: {
  url: string;
  pageTitle?: string;
  dateAccessed?: string;
}): Promise<UrlData> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = currentUser.uid;
    const newUrl = {
      url: urlData.url,
      pageTitle: urlData.pageTitle || 'Untitled',
      dateAccessed: urlData.dateAccessed || new Date().toISOString(),
      summary: 'Generated summary will appear here once processed.', // Placeholder
      tags: ['pending'],
      processingStatus: 'pending' as const,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'urls'), newUrl);
    
    // Return the saved URL data with the new ID
    return {
      id: docRef.id,
      url: newUrl.url,
      pageTitle: newUrl.pageTitle,
      dateAccessed: newUrl.dateAccessed,
      summary: newUrl.summary,
      tags: newUrl.tags,
      processingStatus: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving URL:', error);
    throw error;
  }
}; 