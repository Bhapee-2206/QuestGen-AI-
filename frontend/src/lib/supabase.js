import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if keys are actually provided and not placeholders
export const isConfigured = supabaseAnonKey !== '' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'

// Initialize client with a fallback to avoid crash
export const supabase = createClient(supabaseUrl, isConfigured ? supabaseAnonKey : 'dummy-key')
