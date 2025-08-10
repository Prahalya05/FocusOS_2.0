export default function TimerPage() {
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
            25:00
          </div>
          <p className="text-gray-600 mt-2">Focus Time</p>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium">
            Start
          </button>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium">
            Pause
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium">
            Reset
          </button>
        </div>

        {/* Session Type */}
        <div className="flex justify-center space-x-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Focus (25m)
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            Short Break (5m)
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            Long Break (15m)
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
              defaultValue={25}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="shortBreak" className="block text-sm font-medium text-gray-700 mb-2">
              Short Break (minutes)
            </label>
            <input
              type="number"
              id="shortBreak"
              defaultValue={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="longBreak" className="block text-sm font-medium text-gray-700 mb-2">
              Long Break (minutes)
            </label>
            <input
              type="number"
              id="longBreak"
              defaultValue={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
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
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Morning Focus Session</h3>
                <p className="text-sm text-gray-500">9:00 AM - 9:25 AM</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">25 minutes</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Afternoon Focus Session</h3>
                <p className="text-sm text-gray-500">2:00 PM - 2:25 PM</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">25 minutes</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Evening Focus Session</h3>
                <p className="text-sm text-gray-500">7:00 PM - 7:15 PM</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">15 minutes</div>
                <div className="text-sm text-yellow-600">In Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">65</div>
          <div className="text-sm text-gray-600">Minutes Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600">Sessions Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">85%</div>
          <div className="text-sm text-gray-600">Focus Rate</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-900">Quick Focus</div>
            <div className="text-xs text-gray-600">15 min session</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 text-2xl mb-2">☕</div>
            <div className="text-sm font-medium text-gray-900">Take Break</div>
            <div className="text-xs text-gray-600">5 min break</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-900">View Stats</div>
            <div className="text-xs text-gray-600">Progress report</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium text-gray-900">Settings</div>
            <div className="text-xs text-gray-600">Customize timer</div>
          </button>
        </div>
      </div>
    </div>
  )
}
