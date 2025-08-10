export default function MoodPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracking</h1>
        <p className="mt-2 text-gray-600">Track your daily mood and emotional well-being</p>
      </div>

      {/* Current Mood Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h2>
        <div className="space-y-4">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select your mood:</label>
            <div className="grid grid-cols-5 gap-3">
              <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center">
                <div className="text-3xl mb-2">😡</div>
                <div className="text-xs font-medium text-red-800">Angry</div>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
                <div className="text-3xl mb-2">😞</div>
                <div className="text-xs font-medium text-orange-800">Sad</div>
              </button>
              <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center">
                <div className="text-3xl mb-2">😐</div>
                <div className="text-xs font-medium text-yellow-800">Neutral</div>
              </button>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <div className="text-3xl mb-2">😊</div>
                <div className="text-xs font-medium text-blue-800">Happy</div>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                <div className="text-3xl mb-2">🤩</div>
                <div className="text-xs font-medium text-green-800">Excited</div>
              </button>
            </div>
          </div>

          {/* Mood Description */}
          <div>
            <label htmlFor="moodDescription" className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              id="moodDescription"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what's affecting your mood today..."
            />
          </div>

          {/* Mood Factors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What factors influenced your mood?
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Sleep
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Work
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Exercise
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Social
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Health
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200">
                Weather
              </button>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Log Mood
          </button>
        </div>
      </div>

      {/* Today's Mood Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Mood</h2>
        <div className="flex items-center space-x-4">
          <div className="text-6xl">😊</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Happy</h3>
            <p className="text-gray-600">Logged at 2:30 PM</p>
            <p className="text-sm text-gray-500 mt-1">Feeling productive and motivated today!</p>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mood History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">😊</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Happy</h3>
                  <p className="text-sm text-gray-500">Had a great workout session</p>
                  <p className="text-xs text-gray-400">Yesterday, 6:45 PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">8/10</div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">😐</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Neutral</h3>
                  <p className="text-sm text-gray-500">Busy day at work</p>
                  <p className="text-xs text-gray-400">2 days ago, 8:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">5/10</div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">😞</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Sad</h3>
                  <p className="text-sm text-gray-500">Feeling tired and unmotivated</p>
                  <p className="text-xs text-gray-400">3 days ago, 9:15 PM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">3/10</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Mood Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Mood Trend</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monday</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">8/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tuesday</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">7/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wednesday</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">5/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thursday</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">9/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Friday</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">7.5/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Mood</span>
              <span className="text-lg font-bold text-blue-600">7.2/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Most Common Mood</span>
              <span className="text-sm font-medium text-gray-900">😊 Happy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mood Streak</span>
              <span className="text-lg font-bold text-green-600">5 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Entries</span>
              <span className="text-lg font-bold text-purple-600">28</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Positive Patterns</h4>
            <p className="text-sm text-blue-700">Your mood tends to be better on days when you exercise and get good sleep.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Triggers</h4>
            <p className="text-sm text-yellow-700">Work stress and poor sleep quality often lead to lower mood scores.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Recommendations</h4>
            <p className="text-sm text-green-700">Try to maintain a consistent sleep schedule and include daily exercise.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
