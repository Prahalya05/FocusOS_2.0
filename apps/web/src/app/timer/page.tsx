'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Session {
  id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  startTime: string
  endTime?: string
  status: 'completed' | 'in-progress' | 'paused'
}

export default function TimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionType, setSessionType] = useState<'focus' | 'short-break' | 'long-break'>('focus')
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true
  })

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Session completed
            completeSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, timeLeft])

  const completeSession = useCallback(() => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        status: 'completed' as const
      }
      setSessions(prev => [updatedSession, ...prev])
      setCurrentSession(null)
      setIsRunning(false)
      setIsPaused(false)
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks && sessionType === 'focus') {
        startShortBreak()
      }
    }
  }, [currentSession, settings.autoStartBreaks, sessionType])

  const startSession = (type: 'focus' | 'short-break' | 'long-break') => {
    const duration = type === 'focus' ? settings.focusTime : 
                    type === 'short-break' ? settings.shortBreak : 
                    settings.longBreak
    
    const newSession: Session = {
      id: Date.now().toString(),
      type,
      duration: duration * 60,
      startTime: new Date().toISOString(),
      status: 'in-progress'
    }
    
    setCurrentSession(newSession)
    setSessionType(type)
    setTimeLeft(duration * 60)
    setIsRunning(true)
    setIsPaused(false)
  }

  const startShortBreak = () => {
    startSession('short-break')
  }

  const startLongBreak = () => {
    startSession('long-break')
  }

  const pauseTimer = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null)
      setIsPaused(true)
    }
  }

  const resumeTimer = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, status: 'in-progress' } : null)
      setIsPaused(false)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentSession(null)
    setTimeLeft(settings.focusTime * 60)
    setSessionType('focus')
  }

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    if (!isRunning) {
      setTimeLeft(newSettings.focusTime ? newSettings.focusTime * 60 : timeLeft)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = sessions.filter(s => s.startTime.startsWith(today))
    const completedSessions = todaySessions.filter(s => s.status === 'completed')
    const totalMinutes = completedSessions.reduce((acc, s) => acc + s.duration / 60, 0)
    
    return {
      totalMinutes: Math.round(totalMinutes),
      sessionsCount: completedSessions.length,
      focusRate: completedSessions.length > 0 ? 
        Math.round((completedSessions.filter(s => s.type === 'focus').length / completedSessions.length) * 100) : 0
    }
  }

  const stats = getSessionStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Focus Timer</h1>
        <p className="mt-2 text-gray-600">Stay focused and productive with timed sessions</p>
      </div>

      {/* Main Timer Display */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Session</h2>
          <div className="text-6xl font-bold text-blue-600 font-mono">
            {formatTime(timeLeft)}
          </div>
          <p className="text-gray-600 mt-2">
            {sessionType === 'focus' ? 'Focus Time' : 
             sessionType === 'short-break' ? 'Short Break' : 'Long Break'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isRunning ? (
            <button 
              onClick={() => startSession(sessionType)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
            >
              Start
            </button>
          ) : isPaused ? (
            <button 
              onClick={resumeTimer}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
            >
              Resume
            </button>
          ) : (
            <button 
              onClick={pauseTimer}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 font-medium"
            >
              Pause
            </button>
          )}
          
          <button 
            onClick={resetTimer}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
          >
            Reset
          </button>
        </div>

        {/* Session Type */}
        <div className="flex justify-center space-x-2">
          <button 
            onClick={() => startSession('focus')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sessionType === 'focus' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Focus ({settings.focusTime}m)
          </button>
          <button 
            onClick={startShortBreak}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sessionType === 'short-break' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Short Break ({settings.shortBreak}m)
          </button>
          <button 
            onClick={startLongBreak}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sessionType === 'long-break' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Long Break ({settings.longBreak}m)
          </button>
        </div>
      </div>

      {/* Timer Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="focusTime" className="block text-sm font-medium text-gray-700 mb-2">
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              id="focusTime"
              value={settings.focusTime}
              onChange={(e) => updateSettings({ focusTime: parseInt(e.target.value) || 25 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="120"
            />
          </div>
          <div>
            <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-700 mb-2">
              Short Break (minutes)
            </label>
            <input
              type="number"
              id="shortBreak"
              value={settings.shortBreak}
              onChange={(e) => updateSettings({ shortBreak: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="30"
            />
          </div>
          <div>
            <label htmlFor="longBreak" className="block text-sm font-medium text-gray-700 mb-2">
              Long Break (minutes)
            </label>
            <input
              type="number"
              id="longBreak"
              value={settings.longBreak}
              onChange={(e) => updateSettings({ longBreak: parseInt(e.target.value) || 15 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="60"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-start breaks</span>
          </label>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Today's Sessions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No sessions completed today. Start your first focus session!
            </div>
          ) : (
            sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {session.type === 'focus' ? 'Focus Session' : 
                       session.type === 'short-break' ? 'Short Break' : 'Long Break'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session.startTime).toLocaleTimeString()} - 
                      {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'In Progress'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(session.duration / 60)} minutes
                    </div>
                    <div className={`text-sm ${
                      session.status === 'completed' ? 'text-green-600' : 
                      session.status === 'in-progress' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {session.status === 'completed' ? 'Completed' : 
                       session.status === 'in-progress' ? 'In Progress' : 'Paused'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Focus Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalMinutes}</div>
          <div className="text-sm text-gray-600">Minutes Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sessionsCount}</div>
          <div className="text-sm text-gray-600">Sessions Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.focusRate}%</div>
          <div className="text-sm text-gray-600">Focus Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.floor(stats.totalMinutes / settings.focusTime)}
          </div>
          <div className="text-sm text-gray-600">Focus Sessions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => startSession('focus')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="text-blue-600 text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-900">Quick Focus</div>
            <div className="text-xs text-gray-600">15 min session</div>
          </button>
          <button 
            onClick={startShortBreak}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="text-green-600 text-2xl mb-2">☕</div>
            <div className="text-sm font-medium text-gray-900">Take Break</div>
            <div className="text-xs text-gray-600">5 min break</div>
          </button>
          <Link 
            href="/dashboard"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="text-purple-600 text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">View Stats</div>
            <div className="text-xs text-gray-600">Progress report</div>
          </Link>
          <Link 
            href="/tasks"
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="text-orange-600 text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-900">Tasks</div>
            <div className="text-xs text-gray-600">Manage tasks</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
