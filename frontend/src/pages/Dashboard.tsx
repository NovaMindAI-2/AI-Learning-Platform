import { useAuthStore } from '@/stores/authStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.email}!
          </h2>
          <p className="text-gray-600 mb-4">
            Your learning dashboard is coming soon. You'll be able to see:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Your progress and completed lessons</li>
            <li>Knowledge base with learned vocabulary</li>
            <li>Upcoming lessons and schedule</li>
            <li>Performance metrics and achievements</li>
          </ul>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Status: Onboarding completed ✓
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
