'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MoodEntry {
  id: string
  mood: 'angry' | 'sad' | 'neutral' | 'happy' | 'excited'
  description: string
  factors: string[]
  timestamp: string
}

interface MoodStats {
  averageMood: number
  mostCommonMood: 'angry' | 'sad' | 'neutral' | 'happy' | 'excited'
  moodStreak: number
  totalEntries: number
}

export default function MoodPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMood, setCurrentMood] = useState<'angry' | 'sad' | 'neutral' | 'happy' | 'excited'>('neutral')
  const [description, setDescription] = useState('')
  const [selectedFactors, setSelectedFactors] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const moodOptions = [
    { value: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-600' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-600' },
    { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-600' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: 'text-yellow-600' },
    { value: 'excited', emoji: '🤩', label: 'Excited', color: 'text-green-600' }
  ]

  const moodFactors = [
    'Sleep', 'Work', 'Exercise', 'Social', 'Health', 'Weather'
  ]

  // Initialize with sample data
  useEffect(() => {
    const sampleEntries: MoodEntry[] = [
      {
        id: '1',
        mood: 'happy',
        description: 'Had a great workout this morning and feeling energized',
        factors: ['Exercise', 'Health'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        mood: 'neutral',
        description: 'Regular work day, nothing special',
        factors: ['Work'],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        mood: 'excited',
        description: 'Completed a challenging project successfully!',
        factors: ['Work', 'Social'],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    setMoodEntries(sampleEntries)
  }, [])

  const logMood = () => {
    if (description.trim()) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: currentMood,
        description: description.trim(),
        factors: selectedFactors,
        timestamp: new Date().toISOString()
      }
      setMoodEntries([newEntry, ...moodEntries])
      setDescription('')
      setSelectedFactors([])
      setCurrentMood('neutral')
    }
  }

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    )
  }

  const deleteMoodEntry = (id: string) => {
    setMoodEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const getMoodStats = (): MoodStats => {
    if (moodEntries.length === 0) {
      return {
        averageMood: 0,
        mostCommonMood: 'neutral',
        moodStreak: 0,
        totalEntries: 0
      }
    }

    const moodValues = { angry: 1, sad: 2, neutral: 3, happy: 4, excited: 5 }
    const moodCounts = { angry: 0, sad: 0, neutral: 0, happy: 0, excited: 0 }
    
    moodEntries.forEach(entry => {
      moodCounts[entry.mood]++
    })

    const totalValue = moodEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0)
    const averageMood = Math.round(totalValue / moodEntries.length)
    
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0] as keyof typeof moodCounts] > moodCounts[b[0] as keyof typeof moodCounts] ? a : b
    )[0] as keyof typeof moodCounts

    // Calculate mood streak (consecutive days with mood entries)
    const today = new Date().toISOString().split('T')[0]
    let streak = 0
    let currentDate = new Date()
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const hasEntry = moodEntries.some(entry => entry.timestamp.startsWith(dateStr))
      if (hasEntry) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return {
      averageMood,
      mostCommonMood,
      moodStreak: streak,
      totalEntries: moodEntries.length
    }
  }

  const getWeeklyMoodTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return last7Days.map(date => {
      const dayEntries = moodEntries.filter(entry => entry.timestamp.startsWith(date))
      if (dayEntries.length === 0) return { date, average: 0, count: 0 }
      
      const moodValues = { angry: 1, sad: 2, neutral: 3, happy: 4, excited: 5 }
      const totalValue = dayEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0)
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        average: totalValue / dayEntries.length,
        count: dayEntries.length
      }
    })
  }

  const stats = getMoodStats()
  const weeklyTrend = getWeeklyMoodTrend()

  const getMoodInsights = () => {
    if (moodEntries.length === 0) return []
    
    const insights = []
    const factorCounts: Record<string, number> = {}
    
    moodEntries.forEach(entry => {
      entry.factors.forEach(factor => {
        factorCounts[factor] = (factorCounts[factor] || 0) + 1
      })
    })

    const topFactor = Object.entries(factorCounts).sort((a, b) => b[1] - a[1])[0]
    if (topFactor) {
      insights.push(`"${topFactor[0]}" is your most tracked mood factor`)
    }

    if (stats.averageMood >= 4) {
      insights.push('You\'ve been in a positive mood lately!')
    } else if (stats.averageMood <= 2) {
      insights.push('Consider what might be affecting your mood negatively')
    }

    if (stats.moodStreak >= 7) {
      insights.push(`Great job! You've tracked your mood for ${stats.moodStreak} consecutive days`)
    }

    return insights
  }

  const insights = getMoodInsights()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracking</h1>
        <p className="mt-2 text-gray-600">Monitor your daily mood and energy levels</p>
      </div>

      {/* Current Mood Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling right now?</h2>
        
        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select your mood:</label>
          <div className="flex flex-wrap gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCurrentMood(option.value as any)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  currentMood === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-3xl mb-2">{option.emoji}</span>
                <span className={`text-sm font-medium ${option.color}`}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="moodDescription" className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind? (optional)
          </label>
          <textarea
            id="moodDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what's affecting your mood today..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Mood Factors */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What factors influenced your mood today?
          </label>
          <div className="flex flex-wrap gap-2">
            {moodFactors.map((factor) => (
              <button
                key={factor}
                onClick={() => toggleFactor(factor)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFactors.includes(factor)
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {factor}
              </button>
            ))}
          </div>
        </div>

        {/* Log Button */}
        <button
          onClick={logMood}
          disabled={!description.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          Log Mood
        </button>
      </div>

      {/* Today's Mood Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Mood Summary</h2>
        {moodEntries.length > 0 && moodEntries[0].timestamp.startsWith(new Date().toISOString().split('T')[0]) ? (
          <div className="flex items-center space-x-4">
            <span className="text-4xl">
              {moodOptions.find(opt => opt.value === moodEntries[0].mood)?.emoji}
            </span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {moodOptions.find(opt => opt.value === moodEntries[0].mood)?.label}
              </h3>
              <p className="text-gray-600">{moodEntries[0].description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {moodEntries[0].factors.map(factor => (
                  <span key={factor} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No mood logged today yet. How are you feeling?</p>
        )}
      </div>

      {/* Mood Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.averageMood}/5</div>
          <div className="text-sm text-gray-600">Average Mood</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {moodOptions.find(opt => opt.value === stats.mostCommonMood)?.emoji}
          </div>
          <div className="text-sm text-gray-600">Most Common</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.moodStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.totalEntries}</div>
          <div className="text-sm text-gray-600">Total Entries</div>
        </div>
      </div>

      {/* Weekly Mood Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Mood Trend</h2>
        <div className="space-y-3">
          {weeklyTrend.map((day, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">{day.date}</div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(day.average / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right text-sm text-gray-600">
                {day.count > 0 ? `${day.average.toFixed(1)}/5` : 'No data'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Mood History</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>
        {showHistory && (
          <div className="divide-y divide-gray-200">
            {moodEntries.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No mood entries yet. Start tracking your mood!
              </div>
            ) : (
              moodEntries.map((entry) => (
                <div key={entry.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {moodOptions.find(opt => opt.value === entry.mood)?.emoji}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {moodOptions.find(opt => opt.value === entry.mood)?.label}
                        </h3>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.factors.map(factor => (
                            <span key={factor} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {factor}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMoodEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mood Insights */}
      {insights.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Insights</h2>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-blue-600 text-lg">💡</span>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/dashboard"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            <div className="text-blue-600 text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">Dashboard</div>
            <div className="text-xs text-gray-600">View overview</div>
          </Link>
          <Link 
            href="/timer"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
          >
            <div className="text-green-600 text-2xl mb-2">⏰</div>
            <div className="text-sm font-medium text-gray-900">Focus Timer</div>
            <div className="text-xs text-gray-600">Stay productive</div>
          </Link>
          <Link 
            href="/tasks"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <div className="text-purple-600 text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-900">Tasks</div>
            <div className="text-xs text-gray-600">Manage tasks</div>
          </Link>
          <Link 
            href="/friends"
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
          >
            <div className="text-orange-600 text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-gray-900">Friends</div>
            <div className="text-xs text-gray-600">Connect & share</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
