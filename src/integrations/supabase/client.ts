// src/integrations/supabase/client.ts
// This file initializes the Supabase client. Do not hardcode secrets.
// Import this client anywhere in your app to interact with Supabase.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Load environment variables (must start with VITE_ in Vite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please set the following environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  console.error('- VITE_MAPBOX_TOKEN (optional, for maps)');
  
  // Show user-friendly error message
  if (typeof window !== 'undefined') {
    const errorMsg = document.createElement('div');
    errorMsg.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #064e3b 0%, #166534 100%); color: white; display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
        <div style="max-width: 600px; text-align: center; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.2);">
          <h1 style="font-size: 32px; margin-bottom: 20px;">🌿 Configuration Required</h1>
          <p style="font-size: 18px; margin-bottom: 30px; line-height: 1.6;">
            TradioLife needs environment variables to connect to Supabase.
          </p>
          <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; text-align: left; font-family: monospace; font-size: 14px; margin-bottom: 20px;">
            <p>Missing variables:</p>
            <p style="color: #fca5a5;">• VITE_SUPABASE_URL</p>
            <p style="color: #fca5a5;">• VITE_SUPABASE_ANON_KEY</p>
          </div>
          <p style="font-size: 14px; opacity: 0.8;">
            Contact the site administrator or check the deployment settings.
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(errorMsg);
  }
  
  throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

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
