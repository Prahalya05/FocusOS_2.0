import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. App will run in demo mode.')
}

// Create Supabase client with fallback for demo mode
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key'
)

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Demo data functions for when Supabase is not configured
export const demoMode = {
  isEnabled: !isSupabaseConfigured,
  message: 'Running in demo mode - data is not persisted'
}


