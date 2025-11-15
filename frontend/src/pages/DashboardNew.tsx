import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { dashboardAPI } from '@/services/api';
import type { DashboardData } from '@/types';
import ProgressCard from '@/components/ProgressCard';
import ProgressBar from '@/components/ProgressBar';
import KnowledgeBaseCard from '@/components/KnowledgeBaseCard';
import LessonCard from '@/components/LessonCard';

export default function DashboardNew() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardAPI.getData();
      setDashboardData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md">
          <p className="text-red-700 mb-4">{error || 'Failed to load dashboard'}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { stats, curriculum, knowledgeItems, recentSessions, nextLesson, profile } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/ai-intro')}
                className="text-gray-600 hover:text-gray-900"
              >
                AI Tutor
              </button>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.email?.split('@')[0]}! 👋
              </h2>
              <p className="text-primary-100">
                {stats.currentStreak > 0
                  ? `You're on a ${stats.currentStreak} day streak! Keep it up! 🔥`
                  : "Let's start your learning journey today!"}
              </p>
            </div>
            <div className="text-6xl">
              {stats.currentStreak > 0 ? '🔥' : '🎓'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Lessons Completed"
            value={stats.completedLessons}
            subtitle={`of ${stats.totalLessons} total`}
            icon="📚"
          />
          <ProgressCard
            title="Knowledge Items"
            value={stats.knowledgeCount}
            subtitle="Words & phrases learned"
            icon="🧠"
          />
          <ProgressCard
            title="Study Time"
            value={formatStudyTime(stats.totalStudyMinutes)}
            subtitle="Total time learning"
            icon="⏱️"
          />
          <ProgressCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="Days in a row"
            icon="🔥"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
              <ProgressBar
                current={stats.completedLessons}
                total={stats.totalLessons}
                label="Curriculum Progress"
              />
              {profile && (
                <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Learning Goal</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {profile.learningGoal.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Level</p>
                    <p className="font-medium text-gray-900">{profile.currentLevel.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Target Timeline</p>
                    <p className="font-medium text-gray-900">{profile.timelineWeeks} weeks</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Study Frequency</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {profile.studyFrequency.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Lesson */}
            {nextLesson ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h3>
                <LessonCard
                  lessonNumber={nextLesson.lessonNumber}
                  title={nextLesson.title}
                  description={nextLesson.description}
                  duration={nextLesson.durationMinutes}
                  completed={false}
                  objectives={nextLesson.objectives}
                  onStart={() => {
                    // Navigate to lesson page (to be implemented)
                    alert('Lesson 1 implementation coming soon!');
                  }}
                />
              </div>
            ) : (
              <div className="card text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Curriculum Complete!
                </h3>
                <p className="text-gray-600">
                  You've completed all lessons. Great job!
                </p>
              </div>
            )}

            {/* Recent Activity */}
            {recentSessions.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {session.lesson?.title || 'Unknown Lesson'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.completedAt
                            ? `Completed ${formatDate(session.completedAt)}`
                            : 'In progress'}
                        </p>
                      </div>
                      {session.durationMinutes && (
                        <span className="text-sm text-gray-500">
                          {session.durationMinutes} min
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Overview */}
            {curriculum && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Curriculum</h3>
                <div className="space-y-4">
                  {curriculum.curriculumSummary.weeks.slice(0, 3).map((week) => (
                    <div key={week.weekNumber} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-bold text-gray-900">
                        Week {week.weekNumber}: {week.theme}
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {week.lessons.map((lesson) => {
                          const lessonData = curriculum.lessons.find(
                            (l) => l.lessonNumber === lesson.lessonNumber
                          );
                          const isCompleted = lessonData?.completed || false;

                          return (
                            <li
                              key={lesson.lessonNumber}
                              className="text-sm text-gray-700 flex items-center"
                            >
                              <span className={isCompleted ? 'text-green-600' : 'text-gray-400'}>
                                {isCompleted ? '✓' : '○'}
                              </span>
                              <span className="ml-2">{lesson.title}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  {curriculum.curriculumSummary.weeks.length > 3 && (
                    <button
                      onClick={() => navigate('/ai-intro')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View full curriculum →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Knowledge Base Preview */}
            <KnowledgeBaseCard
              items={knowledgeItems}
              onViewAll={() => {
                // Navigate to knowledge base page (to be implemented)
                alert('Full knowledge base view coming soon!');
              }}
            />

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/ai-intro')}
                  className="btn btn-primary w-full"
                >
                  Talk to AI Tutor
                </button>
                <button
                  onClick={() => {
                    if (nextLesson) {
                      alert('Lesson 1 implementation coming soon!');
                    }
                  }}
                  className="btn btn-secondary w-full"
                  disabled={!nextLesson}
                >
                  {nextLesson ? 'Start Next Lesson' : 'No Lessons Available'}
                </button>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center">
                <p className="text-4xl mb-3">💪</p>
                <p className="text-gray-700 font-medium italic mb-2">
                  "The limits of my language mean the limits of my world."
                </p>
                <p className="text-sm text-gray-600">— Ludwig Wittgenstein</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
