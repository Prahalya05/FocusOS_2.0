'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

// Types
export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TimerSession {
  id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  startTime: string
  endTime?: string
  status: 'completed' | 'in-progress' | 'paused'
}

export interface MoodEntry {
  id: string
  mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible'
  energy: 'high' | 'medium' | 'low'
  notes: string
  timestamp: string
}

export interface Friend {
  id: string
  name: string
  email: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: string
}

export interface LearningCourse {
  id: string
  title: string
  description: string
  progress: number
  status: 'not-started' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

// State interface
interface DataState {
  tasks: Task[]
  timerSessions: TimerSession[]
  moodEntries: MoodEntry[]
  friends: Friend[]
  learningCourses: LearningCourse[]
}

// Action types
type DataAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TIMER_SESSIONS'; payload: TimerSession[] }
  | { type: 'ADD_TIMER_SESSION'; payload: TimerSession }
  | { type: 'SET_MOOD_ENTRIES'; payload: MoodEntry[] }
  | { type: 'ADD_MOOD_ENTRY'; payload: MoodEntry }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'UPDATE_FRIEND'; payload: Friend }
  | { type: 'SET_LEARNING_COURSES'; payload: LearningCourse[] }
  | { type: 'ADD_LEARNING_COURSE'; payload: LearningCourse }
  | { type: 'UPDATE_LEARNING_COURSE'; payload: LearningCourse }

// Initial state - NO DEFAULT DATA
const initialState: DataState = {
  tasks: [],
  timerSessions: [],
  moodEntries: [],
  friends: [],
  learningCourses: []
}

// Reducer function
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    case 'SET_TIMER_SESSIONS':
      return { ...state, timerSessions: action.payload }
    case 'ADD_TIMER_SESSION':
      return { ...state, timerSessions: [...state.timerSessions, action.payload] }
    case 'SET_MOOD_ENTRIES':
      return { ...state, moodEntries: action.payload }
    case 'ADD_MOOD_ENTRY':
      return { ...state, moodEntries: [...state.moodEntries, action.payload] }
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload }
    case 'ADD_FRIEND':
      return { ...state, friends: [...state.friends, action.payload] }
    case 'UPDATE_FRIEND':
      return {
        ...state,
        friends: state.friends.map(friend =>
          friend.id === action.payload.id ? action.payload : friend
        )
      }
    case 'SET_LEARNING_COURSES':
      return { ...state, learningCourses: action.payload }
    case 'ADD_LEARNING_COURSE':
      return { ...state, learningCourses: [...state.learningCourses, action.payload] }
    case 'UPDATE_LEARNING_COURSE':
      return {
        ...state,
        learningCourses: state.learningCourses.map(course =>
          course.id === action.payload.id ? action.payload : course
        )
      }
    default:
      return state
  }
}

// Context
const DataContext = createContext<{
  state: DataState
  dispatch: React.Dispatch<DataAction>
  actions: {
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateTask: (task: Task) => void
    deleteTask: (id: string) => void
    addTimerSession: (session: Omit<TimerSession, 'id'>) => void
    addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void
    addFriend: (friend: Omit<Friend, 'id' | 'createdAt'>) => void
    updateFriend: (friend: Friend) => void
    addLearningCourse: (course: Omit<LearningCourse, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateLearningCourse: (course: LearningCourse) => void
  }
} | null>(null)

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)
  const { authState } = useAuth()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      if (authState.user?.id) {
        // Load user-specific data
        const userId = authState.user.id
        
        const storedTasks = localStorage.getItem(`focusos_tasks_${userId}`)
        if (storedTasks) {
          dispatch({ type: 'SET_TASKS', payload: JSON.parse(storedTasks) })
        }

        const storedTimerSessions = localStorage.getItem(`focusos_timer_sessions_${userId}`)
        if (storedTimerSessions) {
          dispatch({ type: 'SET_TIMER_SESSIONS', payload: JSON.parse(storedTimerSessions) })
        }

        const storedMoodEntries = localStorage.getItem(`focusos_mood_entries_${userId}`)
        if (storedMoodEntries) {
          dispatch({ type: 'SET_MOOD_ENTRIES', payload: JSON.parse(storedMoodEntries) })
        }

        const storedFriends = localStorage.getItem(`focusos_friends_${userId}`)
        if (storedFriends) {
          dispatch({ type: 'SET_FRIENDS', payload: JSON.parse(storedFriends) })
        }

        const storedLearningCourses = localStorage.getItem(`focusos_learning_courses_${userId}`)
        if (storedLearningCourses) {
          dispatch({ type: 'SET_LEARNING_COURSES', payload: JSON.parse(storedLearningCourses) })
        }
      } else {
        // Clear data when no user is authenticated
        dispatch({ type: 'SET_TASKS', payload: [] })
        dispatch({ type: 'SET_TIMER_SESSIONS', payload: [] })
        dispatch({ type: 'SET_MOOD_ENTRIES', payload: [] })
        dispatch({ type: 'SET_FRIENDS', payload: [] })
        dispatch({ type: 'SET_LEARNING_COURSES', payload: [] })
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }, [authState.user?.id])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.setItem(`focusos_tasks_${userId}`, JSON.stringify(state.tasks))
      }
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error)
    }
  }, [state.tasks, authState.user?.id])

  useEffect(() => {
    try {
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.setItem(`focusos_timer_sessions_${userId}`, JSON.stringify(state.timerSessions))
      }
    } catch (error) {
      console.error('Error saving timer sessions to localStorage:', error)
    }
  }, [state.timerSessions, authState.user?.id])

  useEffect(() => {
    try {
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.setItem(`focusos_mood_entries_${userId}`, JSON.stringify(state.moodEntries))
      }
    } catch (error) {
      console.error('Error saving mood entries to localStorage:', error)
    }
  }, [state.moodEntries, authState.user?.id])

  useEffect(() => {
    try {
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.setItem(`focusos_friends_${userId}`, JSON.stringify(state.friends))
      }
    } catch (error) {
      console.error('Error saving friends to localStorage:', error)
    }
  }, [state.friends, authState.user?.id])

  useEffect(() => {
    try {
      if (authState.user?.id) {
        const userId = authState.user.id
        localStorage.setItem(`focusos_learning_courses_${userId}`, JSON.stringify(state.learningCourses))
      }
    } catch (error) {
      console.error('Error saving learning courses to localStorage:', error)
    }
  }, [state.learningCourses, authState.user?.id])

  // Action creators
  const actions = {
    addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_TASK', payload: newTask })
    },

    updateTask: (task: Task) => {
      const updatedTask = {
        ...task,
        updatedAt: new Date().toISOString()
      }
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
    },

    deleteTask: (id: string) => {
      dispatch({ type: 'DELETE_TASK', payload: id })
    },

    addTimerSession: (sessionData: Omit<TimerSession, 'id'>) => {
      const newSession: TimerSession = {
        ...sessionData,
        id: Date.now().toString()
      }
      dispatch({ type: 'ADD_TIMER_SESSION', payload: newSession })
    },

    addMoodEntry: (entryData: Omit<MoodEntry, 'id' | 'timestamp'>) => {
      const newEntry: MoodEntry = {
        ...entryData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry })
    },

    addFriend: (friendData: Omit<Friend, 'id' | 'createdAt'>) => {
      const newFriend: Friend = {
        ...friendData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_FRIEND', payload: newFriend })
    },

    updateFriend: (friend: Friend) => {
      dispatch({ type: 'UPDATE_FRIEND', payload: friend })
    },

    addLearningCourse: (courseData: Omit<LearningCourse, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newCourse: LearningCourse = {
        ...courseData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      dispatch({ type: 'ADD_LEARNING_COURSE', payload: newCourse })
    },

    updateLearningCourse: (course: LearningCourse) => {
      const updatedCourse = {
        ...course,
        updatedAt: new Date().toISOString()
      }
      dispatch({ type: 'UPDATE_LEARNING_COURSE', payload: updatedCourse })
    }
  }

  return (
    <DataContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </DataContext.Provider>
  )
}

// Hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
