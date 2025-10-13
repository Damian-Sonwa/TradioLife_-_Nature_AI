// src/integrations/supabase/client.ts
// This file initializes the Supabase client. Do not hardcode secrets.
// Import this client anywhere in your app to interact with Supabase.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Load environment variables (must start with VITE_ in Vite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,          // Persist sessions in localStorage
    persistSession: true,           // Keep users logged in
    autoRefreshToken: true,         // Refresh tokens automatically
  },
});

// Example usage in components:
// import { supabase } from "@/integrations/supabase/client";
// const { data, error } = await supabase.from('table_name').select('*');
