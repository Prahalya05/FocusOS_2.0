'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useData } from '@/lib/contexts/DataContext'

export default function AcceptFriendPage() {
  const searchParams = useSearchParams()
  const { actions } = useData()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const acceptFriend = async () => {
      try {
        const token = searchParams.get('token')
        const senderEmail = searchParams.get('senderEmail')
        const senderName = searchParams.get('senderName')

        if (!token || !senderEmail || !senderName) {
          setStatus('error')
          setMessage('Invalid friend request link. Please check the URL and try again.')
          return
        }

        // Call the API to accept the friend request
        const response = await fetch('/api/friends/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            senderEmail,
            senderName,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to accept friend request')
        }

        // Add the friend to local state
        actions.addFriend({
          name: senderName,
          email: senderEmail,
          status: 'accepted'
        })

        setStatus('success')
        setMessage('Friend request accepted successfully! You are now connected.')
      } catch (error) {
        console.error('Error accepting friend request:', error)
        setStatus('error')
        setMessage('Failed to accept friend request. Please try again later.')
      }
    }

    acceptFriend()
  }, [searchParams, actions])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Friend Request</h2>
          <p className="text-gray-600">Please wait while we process your friend request...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Friend Request Accepted!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <a
              href="/friends"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              View Friends
            </a>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <a
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
            >
              Go Home
            </a>
          </>
        )}
      </div>
    </div>
  )
}
