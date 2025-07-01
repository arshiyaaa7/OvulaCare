import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate Supabase URL format
if (!supabaseUrl.includes('supabase.co')) {
  console.warn('Supabase URL format may be incorrect:', supabaseUrl)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          age: number
          height: number
          weight: number
          cycle_length: number
          last_period_date: string
          diagnosed_with_pcos: boolean
          common_symptoms: string[]
          mental_health_concerns: string | null
          personal_goal: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          age: number
          height: number
          weight: number
          cycle_length: number
          last_period_date: string
          diagnosed_with_pcos: boolean
          common_symptoms?: string[]
          mental_health_concerns?: string | null
          personal_goal: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          age?: number
          height?: number
          weight?: number
          cycle_length?: number
          last_period_date?: string
          diagnosed_with_pcos?: boolean
          common_symptoms?: string[]
          mental_health_concerns?: string | null
          personal_goal?: string
          created_at?: string
          updated_at?: string
        }
      }
      mood_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: string
          notes: string | null
          response: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood: string
          notes?: string | null
          response?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: string
          notes?: string | null
          response?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection test successful')
    return { success: true, data }
  } catch (error: any) {
    console.error('Supabase connection test error:', error)
    return { success: false, error: error.message }
  }
}