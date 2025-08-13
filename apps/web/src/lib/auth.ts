import { supabase } from './supabaseClient'
import { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  display_name: string
  role: 'admin' | 'friend'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
}

// Authentication functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: 'admin' // Default role for new users
          }
        }
      })

      if (error) throw error

      // Create user profile in our users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              role: 'admin',
              display_name: displayName,
              email: email
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here, user can still sign in
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },

  // Get current user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error: error as Error }
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Demo mode fallback for when Supabase is not configured
export const demoAuth = {
  async signUp(email: string, password: string, displayName: string) {
    // Simulate signup delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const demoUser = {
      id: `demo_${Date.now()}`,
      email,
      display_name: displayName,
      role: 'admin' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Store in localStorage for demo
    localStorage.setItem('demoUser', JSON.stringify(demoUser))
    localStorage.setItem('demoSession', JSON.stringify({ user: demoUser }))

    // Convert to match Supabase User interface
    const supabaseUser = {
      id: demoUser.id,
      email: demoUser.email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: demoUser.created_at,
      updated_at: demoUser.updated_at
    }

    return { 
      data: { user: supabaseUser, session: { user: supabaseUser } }, 
      error: null 
    }
  },

  async signIn(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo mode, check if there's a stored user or create one
    let demoUser = localStorage.getItem('demoUser')
    
    if (!demoUser) {
      // Create a demo user if none exists
      const newDemoUser = {
        id: `demo_${Date.now()}`,
        email,
        display_name: email.split('@')[0],
        role: 'admin' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem('demoUser', JSON.stringify(newDemoUser))
      demoUser = JSON.stringify(newDemoUser)
    }
    
    if (demoUser) {
      const user = JSON.parse(demoUser)
      
      // Update the session
      localStorage.setItem('demoSession', JSON.stringify({ user }))
      
      // Convert to match Supabase User interface
      const supabaseUser = {
        id: user.id,
        email: user.email,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: user.created_at,
        updated_at: user.updated_at
      }
      
      return { 
        data: { user: supabaseUser, session: { user: supabaseUser } }, 
        error: null 
      }
    }
    
    return { 
      data: null, 
      error: new Error('Invalid credentials') 
    }
  },

  async signOut() {
    localStorage.removeItem('demoUser')
    localStorage.removeItem('demoSession')
    return { error: null }
  },

  async getProfile(userId: string) {
    const demoUser = localStorage.getItem('demoUser')
    return demoUser ? JSON.parse(demoUser) : null
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        const user = JSON.parse(demoUser)
        const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() }
        localStorage.setItem('demoUser', JSON.stringify(updatedUser))
        return { data: updatedUser, error: null }
      }
      return { data: null, error: new Error('User not found') }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  async getSession() {
    const demoSession = localStorage.getItem('demoSession')
    if (demoSession) {
      const session = JSON.parse(demoSession)
      // Ensure the session has the correct structure
      if (session.user) {
        return { 
          session: {
            user: {
              id: session.user.id,
              email: session.user.email,
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: session.user.created_at,
              updated_at: session.user.updated_at
            }
          }, 
          error: null 
        }
      }
    }
    return { 
      session: null, 
      error: null 
    }
  }
}
