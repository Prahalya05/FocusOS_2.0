'use client'

import { useState } from 'react'
import { useData } from '@/lib/contexts/DataContext'

export default function FriendsPage() {
  const { state, dispatch } = useData()
  const { friends } = state
  
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [showAddFriend, setShowAddFriend] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddFriend = async () => {
    if (newFriendEmail.trim()) {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        // Send friend request email
        const response = await fetch('/api/friends/send-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendEmail: newFriendEmail.trim(),
            friendName: newFriendEmail.split('@')[0],
            senderName: 'You', // This would come from user profile
            senderEmail: 'your-email@example.com', // This would come from user profile
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send friend request')
        }

        // Add friend to local state
        const newFriend = {
          id: Date.now().toString(),
          name: newFriendEmail.split('@')[0],
          email: newFriendEmail.trim(),
          status: 'pending' as const,
          lastActive: new Date().toISOString(),
          avatar: newFriendEmail.split('@')[0].substring(0, 2).toUpperCase(),
        }
        dispatch({ type: 'ADD_FRIEND', payload: newFriend })
        
        setNewFriendEmail('')
        setShowAddFriend(false)
        setSuccess('Friend request sent successfully! Check your email for updates.')
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send friend request')
        // Clear error after 5 seconds
        setTimeout(() => setError(null), 5000)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAcceptFriend = (friendId: string) => {
    dispatch({ type: 'UPDATE_FRIEND_STATUS', payload: { id: friendId, status: 'accepted' } })
  }

  const handleDeclineFriend = (friendId: string) => {
    dispatch({ type: 'DELETE_FRIEND', payload: friendId })
  }

  const handleRemoveFriend = (friendId: string) => {
    dispatch({ type: 'DELETE_FRIEND', payload: friendId })
  }

  const pendingFriends = friends.filter(friend => friend.status === 'pending')
  const acceptedFriends = friends.filter(friend => friend.status === 'accepted')

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
        <p className="mt-2 text-gray-600">Connect with friends and stay motivated together</p>
      </div>

      {/* Add Friend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Friend</h2>
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <input
            type="email"
            placeholder="Enter friend's email address"
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={handleAddFriend}
            disabled={!newFriendEmail.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </div>

      {/* Friend Requests */}
      {pendingFriends.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Friend Requests ({pendingFriends.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingFriends.map((friend) => (
              <div key={friend.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{getInitials(friend.name)}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAcceptFriend(friend.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDeclineFriend(friend.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Friends ({acceptedFriends.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {acceptedFriends.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No friends yet. Add some friends to get started!
            </div>
          ) : (
            acceptedFriends.map((friend) => (
              <div key={friend.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium">{getInitials(friend.name)}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('online')}`}>
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-blue-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Remove friend"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Friend Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{friends.length}</div>
          <div className="text-sm text-gray-600">Total Friends</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{acceptedFriends.length}</div>
          <div className="text-sm text-gray-600">Accepted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingFriends.length}</div>
          <div className="text-sm text-gray-600">Pending Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">0</div>
          <div className="text-sm text-gray-600">Group Sessions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAddFriend(true)}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-blue-600 text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-gray-900">Add Friend</div>
            <div className="text-xs text-gray-600">Connect with someone</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium text-gray-900">Challenges</div>
            <div className="text-xs text-gray-600">Compete with friends</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 text-2xl mb-2">📱</div>
            <div className="text-sm font-medium text-gray-900">Invite Friends</div>
            <div className="text-xs text-gray-600">Share FocusOS</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">Leaderboard</div>
            <div className="text-xs text-gray-600">See rankings</div>
          </button>
        </div>
      </div>
    </div>
  )
}
