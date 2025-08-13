'use client'

import { useState } from 'react'
import { useData } from '@/lib/contexts/DataContext'

export default function FriendsPage() {
  const { state, actions } = useData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFriend, setNewFriend] = useState({
    name: '',
    email: '',
    status: 'pending' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFriend.name.trim() && newFriend.email.trim()) {
      actions.addFriend(newFriend)
      setNewFriend({
        name: '',
        email: '',
        status: 'pending'
      })
      setShowAddForm(false)
    }
  }

  const handleStatusChange = (friendId: string, newStatus: 'pending' | 'accepted' | 'blocked') => {
    const friend = state.friends.find(f => f.id === friendId)
    if (friend) {
      actions.updateFriend({ ...friend, status: newStatus })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'blocked': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Connected'
      case 'pending': return 'Pending'
      case 'blocked': return 'Blocked'
      default: return status
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
          <p className="text-gray-600 mt-2">Connect with friends for accountability and support</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
          Add Friend
        </button>
      </div>

      {/* Add Friend Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Friend</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Friend's Name *
              </label>
              <input
                type="text"
                id="name"
                value={newFriend.name}
                onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter friend's name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={newFriend.email}
                onChange={(e) => setNewFriend({ ...newFriend, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter friend's email"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <select
                id="status"
                value={newFriend.status}
                onChange={(e) => setNewFriend({ ...newFriend, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Friend
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Friends</h2>
        </div>
        
        {state.friends.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
            <p className="text-gray-600">Add your first friend to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {state.friends.map((friend) => (
              <div key={friend.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {friend.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{friend.name}</h3>
                      <p className="text-gray-600">{friend.email}</p>
                      <p className="text-xs text-gray-500">
                        Added: {new Date(friend.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(friend.status)}`}>
                      {getStatusText(friend.status)}
                    </span>
                    
                    <select
                      value={friend.status}
                      onChange={(e) => handleStatusChange(friend.id, e.target.value as any)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Request Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How Friend Requests Work</h3>
        <div className="text-blue-800 space-y-2">
          <p>• <strong>Pending:</strong> Friend request sent, waiting for acceptance</p>
          <p>• <strong>Accepted:</strong> Friend connection established, can share progress</p>
          <p>• <strong>Blocked:</strong> Friend request declined or blocked</p>
        </div>
        <p className="text-blue-700 text-sm mt-3">
          Note: When you add a friend, they'll receive an email notification to accept your request.
        </p>
      </div>
    </div>
  )
}
