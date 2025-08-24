import { createClient } from "@supabase/supabase-js";

// Load from .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Throw error if missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL or KEY is missing. Check your .env.local file."
  );
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
