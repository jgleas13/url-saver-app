import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
// These will be set in .env.local for local development
// and in Vercel environment settings for production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 