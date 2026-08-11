import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client – configured from environment variables.
 *
 * To get your keys:
 * 1. Go to https://supabase.com and create a project.
 * 2. Navigate to Project Settings → API.
 * 3. Copy the Project URL and the anon/public key.
 * 4. Create a .env file in the project root (copy from .env.example).
 * 5. Paste your values there.
 *
 * NEVER hardcode credentials. NEVER commit .env to Git.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[ReFound] Supabase env vars are not set. ' +
    'Copy .env.example → .env and add your project credentials.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
)
