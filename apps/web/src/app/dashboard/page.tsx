'use client'

import { useData } from '@/lib/contexts/DataContext'
import Link from 'next/link'

export default function DashboardPage() {
  const { state } = useData()
  const { tasks, moodEntries, friends, learningCourses } = state

  // Calculate statistics
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const pendingTasks = tasks.filter(task => task.status === 'pending').length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length
  const totalTasks = tasks.length

  // Calculate average mood (convert new mood values to numeric)
  const getMoodValue = (mood: string) => {
    switch (mood) {
      case 'excellent': return 10
      case 'good': return 8
      case 'okay': return 5
      case 'bad': return 2
      case 'terrible': return 1
      default: return 5
    }
  }

  const averageMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / moodEntries.length).toFixed(1)
    : '0'

  const acceptedFriends = friends.filter(friend => friend.status === 'accepted').length
  const pendingFriends = friends.filter(friend => friend.status === 'pending').length

  const completedCourses = learningCourses.filter(course => course.status === 'completed').length
  const inProgressCourses = learningCourses.filter(course => course.status === 'in-progress').length

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your productivity overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{highPriorityTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks Overview</h2>
            <Link href="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📝</div>
              <p className="text-gray-600">No tasks yet</p>
              <Link href="/tasks" className="text-blue-600 hover:text-blue-700 text-sm">
                Create your first task
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mood & Wellness */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mood & Wellness</h2>
            <Link href="/mood" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Track Mood
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-semibold text-gray-900">{averageMood}/10</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Entries Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {moodEntries.filter(entry => 
                  new Date(entry.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
          
          {moodEntries.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Mood</h3>
              <div className="space-y-2">
                {moodEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{entry.mood}</span>
                    <span className="text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Friends & Social */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Friends & Social</h2>
            <Link href="/friends" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Friends
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-semibold text-gray-900">{acceptedFriends}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingFriends}</p>
            </div>
          </div>
          
          {friends.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">No friends yet</p>
              <Link href="/friends" className="text-blue-600 hover:text-blue-700 text-sm">
                Add friends
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.slice(0, 3).map((friend) => (
                <div key={friend.id} className="flex items-center justify-between text-sm">
                  <span>{friend.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    friend.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    friend.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {friend.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Learning Progress</h2>
            <Link href="/learning" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{inProgressCourses}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedCourses}</p>
            </div>
          </div>
          
          {learningCourses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">No courses yet</p>
              <Link href="/learning" className="text-blue-600 hover:text-blue-700 text-sm">
                Start learning
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {learningCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/timer" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
            <div className="text-blue-600 text-2xl mb-2">⏰</div>
            <div className="text-sm font-medium text-gray-900">Start Timer</div>
          </Link>
          
          <Link href="/tasks" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
            <div className="text-green-600 text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-900">Add Task</div>
          </Link>
          
          <Link href="/mood" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <div className="text-purple-600 text-2xl mb-2">😊</div>
            <div className="text-sm font-medium text-gray-900">Track Mood</div>
          </Link>
          
          <Link href="/learning" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <div className="text-orange-600 text-2xl mb-2">📚</div>
            <div className="text-sm font-medium text-gray-900">Learn</div>
          </Link>
        </div>
      </div>
    </div>
  )
}


