export default function LearningPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
        <p className="mt-2 text-gray-600">Expand your knowledge and skills with curated content</p>
      </div>

      {/* Learning Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Courses Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Active Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Hours Learned</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Featured Courses</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-800 bg-blue-200 px-2 py-1 rounded-full">Beginner</span>
                <span className="text-xs text-blue-600">4.8 ⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Productivity Fundamentals</h3>
              <p className="text-sm text-gray-600 mb-3">Learn the basics of time management and productivity techniques.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">2 hours</span>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Start
                </button>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded-full">Intermediate</span>
                <span className="text-xs text-green-600">4.9 ⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Focus Techniques</h3>
              <p className="text-sm text-gray-600 mb-3">Master deep work and concentration strategies for better results.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">3.5 hours</span>
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  Continue
                </button>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-purple-800 bg-purple-200 px-2 py-1 rounded-full">Advanced</span>
                <span className="text-xs text-purple-600">4.7 ⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mindfulness & Well-being</h3>
              <p className="text-sm text-gray-600 mb-3">Develop mental clarity and emotional balance for sustained focus.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-600 font-medium">5 hours</span>
                <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Learning */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Time Management Mastery</h3>
                  <p className="text-sm text-gray-500">Module 3: Prioritization Techniques</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs text-gray-600">60% complete</span>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Resume
              </button>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Goal Setting & Achievement</h3>
                  <p className="text-sm text-gray-500">Module 2: SMART Goals Framework</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs text-gray-600">85% complete</span>
                  </div>
                </div>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
            <div className="text-blue-600 text-3xl mb-2">⏰</div>
            <div className="text-sm font-medium text-gray-900">Time Management</div>
            <div className="text-xs text-gray-600">12 courses</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
            <div className="text-green-600 text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-900">Goal Setting</div>
            <div className="text-xs text-gray-600">8 courses</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <div className="text-purple-600 text-3xl mb-2">🧘</div>
            <div className="text-sm font-medium text-gray-900">Mindfulness</div>
            <div className="text-xs text-gray-600">6 courses</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <div className="text-orange-600 text-3xl mb-2">💻</div>
            <div className="text-sm font-medium text-gray-900">Tech Skills</div>
            <div className="text-xs text-gray-600">15 courses</div>
          </button>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Additional Resources</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recommended Articles</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">10 Ways to Improve Your Focus</h4>
                  <p className="text-xs text-gray-600 mt-1">5 min read • Productivity</p>
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">The Science of Habit Formation</h4>
                  <p className="text-xs text-gray-600 mt-1">8 min read • Psychology</p>
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">Building a Morning Routine</h4>
                  <p className="text-xs text-gray-600 mt-1">6 min read • Lifestyle</p>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Video Content</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">TED Talk: The Power of Focus</h4>
                  <p className="text-xs text-gray-600 mt-1">18 min • Motivation</p>
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">Productivity Workshop</h4>
                  <p className="text-xs text-gray-600 mt-1">45 min • Workshop</p>
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">Mindfulness Meditation Guide</h4>
                  <p className="text-xs text-gray-600 mt-1">12 min • Wellness</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm font-medium text-gray-900">First Course</div>
            <div className="text-xs text-gray-600">Completed your first course</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-sm font-medium text-gray-900">Bookworm</div>
            <div className="text-xs text-gray-600">Read 10 articles</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-900">Goal Setter</div>
            <div className="text-xs text-gray-600">Set 5 learning goals</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-sm font-medium text-gray-900">Consistent Learner</div>
            <div className="text-xs text-gray-600">7 day learning streak</div>
          </div>
        </div>
      </div>
    </div>
  )
}
