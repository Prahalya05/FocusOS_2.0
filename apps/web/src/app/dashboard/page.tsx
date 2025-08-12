'use client'

import { useData } from '@/lib/contexts/DataContext'

export default function Dashboard() {
  const { state } = useData()
  const { tasks, timerSessions, moodEntries, friends, learningCourses } = state
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{tasks.filter(task => task.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Focus Time</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(timerSessions.reduce((total, session) => total + session.duration, 0) / 60)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mood Score</p>
              <p className="text-2xl font-semibold text-gray-900">{moodEntries.length > 0 ? (moodEntries.reduce((sum, entry) => {
                const moodValues = { angry: 1, sad: 2, neutral: 5, happy: 8, excited: 10 }
                return sum + moodValues[entry.mood]
              }, 0) / moodEntries.length).toFixed(1) : '0'}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-8">{day}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(20, 60 + Math.random() * 40))}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-900 w-12 text-right">
                  {Math.floor(Math.random() * 8 + 2)}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Categories */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Categories</h3>
          <div className="space-y-4">
            {[
              { name: 'Work', count: 8, color: 'bg-blue-500' },
              { name: 'Study', count: 6, color: 'bg-green-500' },
              { name: 'Personal', count: 4, color: 'bg-purple-500' },
              { name: 'Health', count: 3, color: 'bg-orange-500' },
              { name: 'Other', count: 3, color: 'bg-gray-500' }
            ].map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Completed task', details: 'Review project proposal', time: '2 hours ago', type: 'success' },
            { action: 'Started focus session', details: 'Work on mobile app', time: '4 hours ago', type: 'info' },
            { action: 'Updated mood', details: 'Feeling productive', time: '6 hours ago', type: 'mood' },
            { action: 'Added new task', details: 'Plan team meeting', time: '1 day ago', type: 'task' },
            { action: 'Completed goal', details: 'Read 3 chapters', time: '2 days ago', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'info' ? 'bg-blue-500' :
                activity.type === 'mood' ? 'bg-purple-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


