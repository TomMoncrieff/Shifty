import { createClient } from '@supabase/supabase-js';

// Safe to expose: the anon key only allows what Row Level Security permits.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
