import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { DataProvider } from '@/lib/contexts/DataContext'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import AuthWrapper from '@/components/auth/AuthWrapper'
import UserMenu from '@/components/navigation/UserMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FocusOS - Focus & Productivity App',
  description: 'Stay focused, track progress, and achieve your goals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <AuthWrapper>
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        FocusOS
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Home
                      </Link>
                      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Tasks
                      </Link>
                      <Link href="/timer" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Timer
                      </Link>
                      <Link href="/mood" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Mood
                      </Link>
                      <Link href="/friends" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Friends
                      </Link>
                      <Link href="/learning" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Learning
                      </Link>
                      <UserMenu />
                    </div>
                  </div>
                </div>
              </nav>
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </AuthWrapper>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


