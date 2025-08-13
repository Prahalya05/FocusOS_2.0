'use client'

import { useState, useEffect, useRef } from 'react'
import { useData } from '@/lib/contexts/DataContext'

interface TimerState {
  isRunning: boolean
  isBreak: boolean
  timeLeft: number
  totalTime: number
  mode: 'focus' | 'short-break' | 'long-break'
}

const TIMER_SETTINGS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60 // 15 minutes
}

export default function TimerPage() {
  const { actions } = useData()
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    isBreak: false,
    timeLeft: TIMER_SETTINGS.focus,
    totalTime: TIMER_SETTINGS.focus,
    mode: 'focus'
  })
  
  const [completedSessions, setCompletedSessions] = useState(0)
  const [autoStartBreaks, setAutoStartBreaks] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3') // You'll need to add this audio file
    // Fallback to browser notification if audio fails
    if (!audioRef.current) {
      console.log('Audio not available, using browser notifications')
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            playNotificationSound()
            showNotification()
            
            if (prev.mode === 'focus') {
              // Focus session completed
              setCompletedSessions(prev => prev + 1)
              
              // Don't auto-start break, wait for user
              return {
                ...prev,
                isRunning: false,
                timeLeft: 0
              }
            } else {
              // Break finished
              return {
                ...prev,
                isRunning: false,
                timeLeft: 0
              }
            }
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          }
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState.isRunning, timerState.timeLeft, timerState.mode])

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log('Audio playback failed, using browser notification')
      })
    }
  }

  // Show browser notification
  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = timerState.mode === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!'
      const body = timerState.mode === 'focus' 
        ? 'Great job! Take a break or start another session.' 
        : 'Break time is over. Ready to focus again?'
      
      new Notification(title, { body })
    }
  }

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // Start timer
  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }))
  }

  // Pause timer
  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }))
  }

  // Stop timer and reset
  const stopTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.totalTime
    }))
  }

  // Switch to focus mode
  const switchToFocus = () => {
    setTimerState({
      isRunning: false,
      isBreak: false,
      timeLeft: TIMER_SETTINGS.focus,
      totalTime: TIMER_SETTINGS.focus,
      mode: 'focus'
    })
  }

  // Switch to short break
  const switchToShortBreak = () => {
    setTimerState({
      isRunning: false,
      isBreak: true,
      timeLeft: TIMER_SETTINGS.shortBreak,
      totalTime: TIMER_SETTINGS.shortBreak,
      mode: 'short-break'
    })
  }

  // Switch to long break
  const switchToLongBreak = () => {
    setTimerState({
      isRunning: false,
      isBreak: true,
      timeLeft: TIMER_SETTINGS.longBreak,
      totalTime: TIMER_SETTINGS.longBreak,
      mode: 'long-break'
    })
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const progressPercentage = ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100

  // Save completed session
  const saveSession = () => {
    if (timerState.mode === 'focus' && timerState.timeLeft === 0) {
      actions.addTimerSession({
        type: 'focus',
        duration: TIMER_SETTINGS.focus,
        startTime: new Date(Date.now() - TIMER_SETTINGS.focus * 1000).toISOString(),
        endTime: new Date().toISOString(),
        status: 'completed'
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h1>
        <p className="text-gray-600">Stay focused and productive with Pomodoro technique</p>
      </div>

      {/* Timer Display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="text-center">
          {/* Mode Indicator */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              timerState.mode === 'focus' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {timerState.mode === 'focus' ? 'Focus Time' : 'Break Time'}
            </span>
          </div>

          {/* Timer Display */}
          <div className="text-8xl font-mono font-bold text-gray-900 mb-6">
            {formatTime(timerState.timeLeft)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timerState.mode === 'focus' ? 'bg-blue-600' : 'bg-green-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!timerState.isRunning ? (
              <button
                onClick={startTimer}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Pause
              </button>
            )}
            
            <button
              onClick={stopTimer}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Stop
            </button>
          </div>

          {/* Session Complete Actions */}
          {timerState.timeLeft === 0 && timerState.mode === 'focus' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">🎉 Focus Session Complete!</h3>
              <p className="text-green-700 mb-4">Great job! Take a break or start another session.</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={switchToShortBreak}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Take Short Break (5 min)
                </button>
                <button
                  onClick={switchToLongBreak}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Take Long Break (15 min)
                </button>
                <button
                  onClick={switchToFocus}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Start New Session
                </button>
              </div>
            </div>
          )}

          {/* Break Complete Actions */}
          {timerState.timeLeft === 0 && timerState.isBreak && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">⏰ Break Time Over!</h3>
              <p className="text-blue-700 mb-4">Ready to focus again?</p>
              <button
                onClick={switchToFocus}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Start Focus Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timer Mode Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timer Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={switchToFocus}
            className={`p-4 rounded-lg border-2 transition-all ${
              timerState.mode === 'focus'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900">Focus</div>
              <div className="text-sm text-gray-600">25 minutes</div>
            </div>
          </button>

          <button
            onClick={switchToShortBreak}
            className={`p-4 rounded-lg border-2 transition-all ${
              timerState.mode === 'short-break'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">☕</div>
              <div className="font-medium text-gray-900">Short Break</div>
              <div className="text-sm text-gray-600">5 minutes</div>
            </div>
          </button>

          <button
            onClick={switchToLongBreak}
            className={`p-4 rounded-lg border-2 transition-all ${
              timerState.mode === 'long-break'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🌴</div>
              <div className="font-medium text-gray-900">Long Break</div>
              <div className="text-sm text-gray-600">15 minutes</div>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{completedSessions}</div>
            <div className="text-gray-600">Focus Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Math.floor((completedSessions * TIMER_SETTINGS.focus) / 60)}
            </div>
            <div className="text-gray-600">Minutes Focused</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.floor((completedSessions * TIMER_SETTINGS.focus) / 3600)}
            </div>
            <div className="text-gray-600">Hours Focused</div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mt-6 text-center">
        <button
          onClick={requestNotificationPermission}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          Enable Browser Notifications
        </button>
      </div>
    </div>
  )
}
