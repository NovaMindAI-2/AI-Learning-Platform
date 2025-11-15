import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TutorLayout from '@/components/TutorLayout';
import AITutorVisual from '@/components/AITutorVisual';
import VoiceControls from '@/components/VoiceControls';
import { curriculumAPI, profileAPI } from '@/services/api';
import type { Curriculum, UserProfile } from '@/types';

type FlowStage = 'greeting' | 'question' | 'generating' | 'presenting' | 'complete';

export default function AIIntroNew() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<FlowStage>('greeting');
  const [tutorStatus, setTutorStatus] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [introduction, setIntroduction] = useState('');
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile and introduction on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Get user profile
      const profileData = await profileAPI.get();
      setProfile(profileData.profile);

      // Get tutor introduction
      const introData = await curriculumAPI.getIntroduction();
      setIntroduction(introData.introduction);

      // Simulate AI speaking
      setTutorStatus('speaking');

      // Use Web Speech API for text-to-speech (fallback)
      speakText(introData.introduction);

      // After introduction, move to question stage
      setTimeout(() => {
        setTutorStatus('idle');
        setStage('question');
      }, 5000); // Adjust based on introduction length

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Failed to load AI tutor. Please try again.');
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => {
        setTutorStatus('idle');
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuestionResponse = async (response: string) => {
    // User answered the follow-up question
    setStage('generating');
    setTutorStatus('thinking');

    try {
      // Generate curriculum
      const curriculumData = await curriculumAPI.generate();
      setCurriculum(curriculumData.curriculum);

      // Present curriculum
      setTutorStatus('speaking');
      const presentationText = `Okay! I've created a ${curriculumData.curriculum.weeksDuration}-week program designed specifically for you. Here's how we'll work together...`;
      speakText(presentationText);

      setTimeout(() => {
        setStage('presenting');
        setTutorStatus('idle');
      }, 3000);
    } catch (err) {
      console.error('Failed to generate curriculum:', err);
      setError('Failed to generate curriculum. Please try again.');
      setTutorStatus('idle');
    }
  };

  const handleStartLesson = () => {
    navigate('/dashboard');
  };

  // Left Panel - AI Tutor
  const leftPanel = (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <AITutorVisual
          name="Amélie"
          status={tutorStatus}
          personality={profile?.tutorPersonality}
        />
      </div>
      <VoiceControls
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onInterrupt={() => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setTutorStatus('idle');
        }}
      />
    </div>
  );

  // Right Panel - Content
  const rightPanel = (
    <div className="p-8">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your AI tutor...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
          <button onClick={loadInitialData} className="btn btn-primary mt-4">
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Greeting Stage */}
          {stage === 'greeting' && (
            <div className="card">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome! 👋
              </h2>
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed">{introduction}</p>
              </div>
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  🎧 Your AI tutor is speaking. Make sure your volume is on!
                </p>
              </div>
            </div>
          )}

          {/* Follow-up Question Stage */}
          {stage === 'question' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Question
              </h2>
              <p className="text-gray-700 mb-6">
                Before I create your perfect curriculum, I have just one quick question:
              </p>
              <p className="text-xl text-gray-900 font-medium mb-6">
                Are there specific situations you want to focus on, like ordering food or asking for directions?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuestionResponse('Yes, ordering food and directions')}
                  className="w-full p-4 border-2 border-primary-500 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-all"
                >
                  <div className="font-medium">Yes, practical travel situations</div>
                  <div className="text-sm text-gray-600">Ordering food, asking directions, shopping</div>
                </button>
                <button
                  onClick={() => handleQuestionResponse('Focus on business conversations')}
                  className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg text-left transition-all"
                >
                  <div className="font-medium">Business conversations</div>
                  <div className="text-sm text-gray-600">Professional settings and work communication</div>
                </button>
                <button
                  onClick={() => handleQuestionResponse('General conversation')}
                  className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg text-left transition-all"
                >
                  <div className="font-medium">General conversation</div>
                  <div className="text-sm text-gray-600">Balanced mix of everyday topics</div>
                </button>
              </div>
            </div>
          )}

          {/* Generating Curriculum Stage */}
          {stage === 'generating' && (
            <div className="card text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Creating Your Curriculum...
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Analyzing your goals...</p>
                <p>Designing lesson sequence...</p>
                <p>Personalizing content...</p>
              </div>
            </div>
          )}

          {/* Presenting Curriculum Stage */}
          {stage === 'presenting' && curriculum && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Personalized Curriculum
                </h2>
                <p className="text-gray-600 mb-6">
                  {curriculum.curriculumSummary.summary}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-600">
                      {curriculum.totalLessons}
                    </div>
                    <div className="text-sm text-gray-600">Total Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-600">
                      {curriculum.weeksDuration}
                    </div>
                    <div className="text-sm text-gray-600">Weeks</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-600">
                      {curriculum.lessonsPerWeek}x
                    </div>
                    <div className="text-sm text-gray-600">Per Week</div>
                  </div>
                </div>
              </div>

              {/* Curriculum Weeks */}
              <div className="space-y-4">
                {curriculum.curriculumSummary.weeks.slice(0, 4).map((week) => (
                  <div key={week.weekNumber} className="card">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Week {week.weekNumber}: {week.theme}
                    </h3>
                    <ul className="space-y-2">
                      {week.lessons.map((lesson) => (
                        <li key={lesson.lessonNumber} className="flex items-start">
                          <span className="text-primary-600 mr-2">✓</span>
                          <div>
                            <span className="font-medium">
                              Lesson {lesson.lessonNumber}: {lesson.title}
                            </span>
                            <span className="text-gray-600 text-sm ml-2">
                              ({lesson.duration} min)
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {curriculum.curriculumSummary.weeks.length > 4 && (
                  <div className="text-center py-4 text-gray-600">
                    ... and {curriculum.curriculumSummary.weeks.length - 4} more weeks
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="card bg-primary-50 border-2 border-primary-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to start your first lesson?
                </h3>
                <p className="text-gray-700 mb-6">
                  Let's dive into Lesson 1: {curriculum.curriculumSummary.weeks[0]?.lessons[0]?.title}
                </p>
                <button onClick={handleStartLesson} className="btn btn-primary w-full py-3 text-lg">
                  Let's Start! 🚀
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary w-full mt-3"
                >
                  View Dashboard Instead
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return <TutorLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
