'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useData } from '@/lib/contexts/DataContext'

function AcceptFriendContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { actions } = useData()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const friendEmail = searchParams.get('email')
  const senderEmail = searchParams.get('sender')

  useEffect(() => {
    if (!friendEmail || !senderEmail) {
      setError('Invalid friend request link')
    }
  }, [friendEmail, senderEmail])

  const handleAccept = async () => {
    if (!friendEmail || !senderEmail) return

    setIsLoading(true)
    setError(null)

    try {
      // Send acceptance email
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendEmail,
          friendName: friendEmail.split('@')[0], // Simple name extraction
          senderEmail,
          senderName: senderEmail.split('@')[0], // Simple name extraction
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to accept friend request')
      }

      // Add friend to local state
      actions.addFriend({
        name: senderEmail.split('@')[0],
        email: senderEmail,
        status: 'accepted',
        lastActive: new Date().toISOString(),
        avatar: senderEmail.split('@')[0].substring(0, 2).toUpperCase(),
      })

      setSuccess(true)
      
      // Redirect to friends page after 3 seconds
      setTimeout(() => {
        router.push('/friends')
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    router.push('/friends')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/friends')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Friends
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">🎉</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Friend Request Accepted!</h1>
          <p className="text-gray-600 mb-4">
            You're now friends with {senderEmail?.split('@')[0]} on FocusOS!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to friends page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="text-blue-500 text-6xl mb-4">👋</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Friend Request</h1>
          <p className="text-gray-600">
            {senderEmail?.split('@')[0]} wants to be your friend on FocusOS!
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Share tasks and goals</li>
            <li>• Track progress together</li>
            <li>• Stay motivated as a team</li>
            <li>• Celebrate achievements</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Accepting...' : 'Accept Friend Request'}
          </button>
          
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Decline
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By accepting, you'll receive notifications about shared activities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AcceptFriendPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-blue-500 text-6xl mb-4">⏳</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load your friend request.</p>
        </div>
      </div>
    }>
      <AcceptFriendContent />
    </Suspense>
  )
}
