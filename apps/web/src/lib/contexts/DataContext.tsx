'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

// Types
export interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate: string
  category: string
  createdAt: string
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
  mood: 'angry' | 'sad' | 'neutral' | 'happy' | 'excited'
  description: string
  factors: string[]
  timestamp: string
}

export interface Friend {
  id: string
  name: string
  email: string
  status: 'pending' | 'accepted' | 'online' | 'offline'
  lastActive: string
  avatar: string
}

export interface LearningCourse {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  progress: number
  rating: number
  enrolled: boolean
}

// State interface
interface AppState {
  tasks: Task[]
  timerSessions: TimerSession[]
  moodEntries: MoodEntry[]
  friends: Friend[]
  learningCourses: LearningCourse[]
  isLoading: boolean
  error: string | null
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TIMER_SESSIONS'; payload: TimerSession[] }
  | { type: 'ADD_TIMER_SESSION'; payload: TimerSession }
  | { type: 'UPDATE_TIMER_SESSION'; payload: TimerSession }
  | { type: 'SET_MOOD_ENTRIES'; payload: MoodEntry[] }
  | { type: 'ADD_MOOD_ENTRY'; payload: MoodEntry }
  | { type: 'DELETE_MOOD_ENTRY'; payload: string }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'UPDATE_FRIEND'; payload: Friend }
  | { type: 'UPDATE_FRIEND_STATUS'; payload: { id: string; status: Friend['status'] } }
  | { type: 'DELETE_FRIEND'; payload: string }
  | { type: 'SET_LEARNING_COURSES'; payload: LearningCourse[] }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: { id: string; progress: number } }

// Initial state
const initialState: AppState = {
  tasks: [],
  timerSessions: [],
  moodEntries: [],
  friends: [],
  learningCourses: [],
  isLoading: false,
  error: null
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
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
      return { ...state, timerSessions: [action.payload, ...state.timerSessions] }
    case 'UPDATE_TIMER_SESSION':
      return { 
        ...state, 
        timerSessions: state.timerSessions.map(session => 
          session.id === action.payload.id ? action.payload : session
        ) 
      }
    case 'SET_MOOD_ENTRIES':
      return { ...state, moodEntries: action.payload }
    case 'ADD_MOOD_ENTRY':
      return { ...state, moodEntries: [action.payload, ...state.moodEntries] }
    case 'DELETE_MOOD_ENTRY':
      return { 
        ...state, 
        moodEntries: state.moodEntries.filter(entry => entry.id !== action.payload) 
      }
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
    case 'UPDATE_FRIEND_STATUS':
      return { 
        ...state, 
        friends: state.friends.map(friend => 
          friend.id === action.payload.id 
            ? { ...friend, status: action.payload.status }
            : friend
        ) 
      }
    case 'DELETE_FRIEND':
      return { 
        ...state, 
        friends: state.friends.filter(friend => friend.id !== action.payload) 
      }
    case 'SET_LEARNING_COURSES':
      return { ...state, learningCourses: action.payload }
    case 'UPDATE_COURSE_PROGRESS':
      return { 
        ...state, 
        learningCourses: state.learningCourses.map(course => 
          course.id === action.payload.id 
            ? { ...course, progress: action.payload.progress }
            : course
        ) 
      }
    default:
      return state
  }
}

// Context
const DataContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  actions: {
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
    updateTask: (task: Task) => void
    deleteTask: (id: string) => void
    addTimerSession: (session: Omit<TimerSession, 'id'>) => void
    updateTimerSession: (session: TimerSession) => void
    addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void
    deleteMoodEntry: (id: string) => void
    addFriend: (friend: Omit<Friend, 'id'>) => void
    updateFriend: (friend: Friend) => void
    updateFriendStatus: (id: string, status: Friend['status']) => void
    deleteFriend: (id: string) => void
    updateCourseProgress: (id: string, progress: number) => void
  }
} | null>(null)

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize with sample data
  useEffect(() => {
    const initializeData = () => {
      // Sample tasks
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Write and submit the quarterly project proposal for Q1',
          priority: 'high',
          status: 'in-progress',
          dueDate: '2024-01-15',
          category: 'Work',
          createdAt: '2024-01-10'
        },
        {
          id: '2',
          title: 'Review code changes',
          description: 'Review pull requests and provide feedback to team members',
          priority: 'medium',
          status: 'todo',
          dueDate: '2024-01-12',
          category: 'Development',
          createdAt: '2024-01-10'
        },
        {
          id: '3',
          title: 'Update documentation',
          description: 'Update API documentation with new endpoints',
          priority: 'low',
          status: 'completed',
          dueDate: '2024-01-08',
          category: 'Documentation',
          createdAt: '2024-01-05'
        }
      ]

      // Sample mood entries
      const sampleMoodEntries: MoodEntry[] = [
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

      // Sample friends
      const sampleFriends: Friend[] = [
        {
          id: '1',
          name: 'Mike Wilson',
          email: 'mike.w@example.com',
          status: 'online',
          lastActive: new Date().toISOString(),
          avatar: 'MW'
        },
        {
          id: '2',
          name: 'Alex Lee',
          email: 'alex.lee@example.com',
          status: 'offline',
          lastActive: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          avatar: 'AL'
        },
        {
          id: '3',
          name: 'Rachel Kim',
          email: 'rachel.k@example.com',
          status: 'online',
          lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          avatar: 'RK'
        }
      ]

      // Sample learning courses
      const sampleCourses: LearningCourse[] = [
        {
          id: '1',
          title: 'Productivity Fundamentals',
          description: 'Learn the basics of time management and productivity techniques.',
          category: 'Time Management',
          difficulty: 'beginner',
          duration: 2,
          progress: 75,
          rating: 4.8,
          enrolled: true
        },
        {
          id: '2',
          title: 'Advanced Focus Techniques',
          description: 'Master deep work and concentration strategies for better results.',
          category: 'Focus',
          difficulty: 'intermediate',
          duration: 3.5,
          progress: 60,
          rating: 4.9,
          enrolled: true
        },
        {
          id: '3',
          title: 'Mindfulness & Well-being',
          description: 'Develop mental clarity and emotional balance for sustained focus.',
          category: 'Wellness',
          difficulty: 'advanced',
          duration: 5,
          progress: 0,
          rating: 4.7,
          enrolled: false
        }
      ]

      dispatch({ type: 'SET_TASKS', payload: sampleTasks })
      dispatch({ type: 'SET_MOOD_ENTRIES', payload: sampleMoodEntries })
      dispatch({ type: 'SET_FRIENDS', payload: sampleFriends })
      dispatch({ type: 'SET_LEARNING_COURSES', payload: sampleCourses })
    }

    initializeData()
  }, [])

  // Action creators
  const actions = {
    addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      dispatch({ type: 'ADD_TASK', payload: newTask })
    },

    updateTask: (task: Task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task })
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

    updateTimerSession: (session: TimerSession) => {
      dispatch({ type: 'UPDATE_TIMER_SESSION', payload: session })
    },

    addMoodEntry: (entryData: Omit<MoodEntry, 'id'>) => {
      const newEntry: MoodEntry = {
        ...entryData,
        id: Date.now().toString()
      }
      dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry })
    },

    deleteMoodEntry: (id: string) => {
      dispatch({ type: 'DELETE_MOOD_ENTRY', payload: id })
    },

    addFriend: (friendData: Omit<Friend, 'id'>) => {
      const newFriend: Friend = {
        ...friendData,
        id: Date.now().toString()
      }
      dispatch({ type: 'ADD_FRIEND', payload: newFriend })
    },

    updateFriend: (friend: Friend) => {
      dispatch({ type: 'UPDATE_FRIEND', payload: friend })
    },

    updateFriendStatus: (id: string, status: Friend['status']) => {
      dispatch({ type: 'UPDATE_FRIEND_STATUS', payload: { id, status } })
    },

    deleteFriend: (id: string) => {
      dispatch({ type: 'DELETE_FRIEND', payload: id })
    },

    updateCourseProgress: (id: string, progress: number) => {
      dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: { id, progress } })
    }
  }

  return (
    <DataContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </DataContext.Provider>
  )
}

// Hook to use the context
export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
