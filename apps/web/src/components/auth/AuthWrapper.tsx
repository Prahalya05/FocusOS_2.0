'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FocusOS...</p>
        </div>
      </div>
    )
  }

  // Show authentication forms if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {showLogin ? (
          <LoginForm
            onSuccess={() => {
              // Login successful, user will be redirected to main app
            }}
            onSwitchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={() => {
              // Registration successful, user will be redirected to main app
            }}
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    )
  }

  // Show main app if authenticated
  return <>{children}</>
}
