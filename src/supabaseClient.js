import { createClient } from '@supabase/supabase-js';

// We grab the secure keys you hid in the .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// We use those keys to build the official bridge to your cloud vault
export const supabase = createClient(supabaseUrl, supabaseAnonKey);