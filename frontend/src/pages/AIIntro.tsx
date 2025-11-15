export default function AIIntro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl px-4">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center animate-pulse">
            <div className="w-40 h-40 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-6xl">🎓</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Meet Your AI Tutor</h1>
        <p className="text-xl text-gray-300 mb-8">
          Bonjour! I'm Amélie, and I'm thrilled to be your French tutor.
        </p>

        <div className="card bg-white/10 backdrop-blur-lg text-left">
          <p className="text-gray-200 mb-4">
            This is where your AI tutor will introduce itself with voice, ask follow-up questions,
            and present your personalized curriculum.
          </p>
          <p className="text-sm text-gray-400">
            Coming next: Voice integration with 11 Labs and Claude API for dynamic conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
