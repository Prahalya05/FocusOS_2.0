'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, demoAuth, AuthState, UserProfile } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  authState: AuthState
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  })

  // Remove the useData hook to break circular dependency
  // const { dispatch } = useData()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authService = isSupabaseConfigured ? auth : demoAuth
        
        // Get current session
        const { session, error } = await authService.getSession()
        
        if (session?.user) {
          // Get user profile
          const profile = await authService.getProfile(session.user.id)
          
          setAuthState({
            user: session.user as User,
            profile,
            session: session as any, // Type assertion for demo mode compatibility
            loading: false
          })

          // Note: User data will be loaded by DataContext when it detects the user
        } else {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          profile: null,
          session: null,
          loading: false
        })
      }
    }

    initializeAuth()

    // Listen for auth changes (Supabase only)
    if (isSupabaseConfigured) {
      const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await auth.getProfile(session.user.id)
          setAuthState({
            user: session.user,
            profile,
            session,
            loading: false
          })
          // Note: User data will be loaded by DataContext when it detects the user
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false
          })
          // Note: DataContext will handle clearing data when user changes
        }
      })

      return () => subscription.unsubscribe()
    }
  }, []) // Remove dispatch dependency

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const authService = isSupabaseConfigured ? auth : demoAuth
      const { data, error } = await authService.signUp(email, password, displayName)

      if (error) {
        return { success: false, error: error.message || 'Sign up failed' }
      }

      if (data?.user) {
        // Get the profile from the auth service
        const profile = await authService.getProfile(data.user.id)
        
        setAuthState({
          user: data.user,
          profile,
          session: data.session as any,
          loading: false
        })
        return { success: true }
      }

      return { success: false, error: 'Sign up failed' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const authService = isSupabaseConfigured ? auth : demoAuth
      const { data, error } = await authService.signIn(email, password)

      if (error) {
        return { success: false, error: error.message || 'Sign in failed' }
      }

      if (data?.user) {
        const profile = await authService.getProfile(data.user.id)
        
        // Convert demo user to Supabase User type for consistency
        let user: User
        if (isSupabaseConfigured) {
          user = data.user
        } else {
          user = {
            id: data.user.id,
            email: data.user.email,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: data.user.created_at,
            updated_at: data.user.updated_at
          } as User
        }

        setAuthState({
          user,
          profile,
          session: data.session as any,
          loading: false
        })

        // Load user data
        // loadUserData(data.user.id) // This function is removed
        return { success: true }
      }

      return { success: false, error: 'Sign in failed' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const authService = isSupabaseConfigured ? auth : demoAuth
      await authService.signOut()

      // Clear user-specific data from localStorage
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.removeItem(`focusos_tasks_${userId}`)
        localStorage.removeItem(`focusos_timer_sessions_${userId}`)
        localStorage.removeItem(`focusos_mood_entries_${userId}`)
        localStorage.removeItem(`focusos_friends_${userId}`)
        localStorage.removeItem(`focusos_learning_courses_${userId}`)
      }

      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false
      })

      // Note: DataContext will handle clearing data when user changes
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) {
        return { success: false, error: 'No user logged in' }
      }

      const authService = isSupabaseConfigured ? auth : demoAuth
      const { data, error } = await authService.updateProfile(authState.user.id, updates)

      if (error) {
        return { success: false, error: error.message || 'Profile update failed' }
      }

      if (data) {
        setAuthState(prev => ({
          ...prev,
          profile: data
        }))
        return { success: true }
      }

      return { success: false, error: 'Profile update failed' }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const value: AuthContextType = {
    authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!authState.user,
    isLoading: authState.loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
