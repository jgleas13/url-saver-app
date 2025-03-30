import supabase from './supabase';

export interface UrlEntry {
  id?: string;
  url: string;
  title: string;
  dateAccessed: string;
  summary: string | null;
  processingStatus: 'pending' | 'completed' | 'failed';
  tags: string[];
  userId: string;
}

/**
 * Store a URL entry in the database
 */
export const storeUrl = async (urlEntry: UrlEntry) => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .insert(urlEntry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error storing URL:', error);
    throw error;
  }
};

/**
 * Get all URL entries for a user
 */
export const getUrlsByUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('userId', userId)
      .order('dateAccessed', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching URLs for user:', error);
    throw error;
  }
};

/**
 * Update URL entry summary and processing status
 */
export const updateUrlSummary = async (id: string, summary: string | null, status: 'completed' | 'failed') => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .update({ 
        summary, 
        processingStatus: status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating URL summary:', error);
    throw error;
  }
};

/**
 * Get URL entry by ID
 */
export const getUrlById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching URL by ID:', error);
    throw error;
  }
}; 