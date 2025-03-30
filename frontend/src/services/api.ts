import { auth, db } from '@/config/firebaseClient';
import { collection, query, getDocs, addDoc, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';

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
    console.log('Fetching URLs for user ID:', userId);
    
    const urlsPath = `users/${userId}/urls`;
    console.log('Collection path:', urlsPath);
    
    const urlsQuery = query(
      collection(db, 'users', userId, 'urls'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(urlsQuery);
    console.log(`Found ${querySnapshot.docs.length} URLs in collection`);
    
    const urlsData: UrlData[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('URL document ID:', doc.id);
      
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

/**
 * Delete a URL from Firestore by ID
 * @param urlId The ID of the URL to delete
 * @returns Promise<void>
 */
export const deleteUrl = async (urlId: string): Promise<void> => {
  try {
    console.log('Attempting to delete URL with ID:', urlId);
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('Delete failed: User not authenticated');
      throw new Error('User not authenticated');
    }

    const userId = currentUser.uid;
    console.log('Current user ID:', userId);
    
    const urlDocRef = doc(db, 'users', userId, 'urls', urlId);
    console.log('Document path:', `users/${userId}/urls/${urlId}`);
    
    await deleteDoc(urlDocRef);
    console.log('URL successfully deleted');
  } catch (error) {
    console.error('Error deleting URL:', error);
    throw error;
  }
}; 