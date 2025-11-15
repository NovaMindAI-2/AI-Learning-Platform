import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '@/services/api';
import type { OnboardingFormData } from '@/types';

const STEPS = {
  WELCOME: 0,
  LEVEL_GOAL: 1,
  SCHEDULE: 2,
  PERSONALITY: 3,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<OnboardingFormData>({
    currentLevel: 'beginner',
    learningGoal: 'conversation',
    timelineWeeks: 12,
    studyFrequency: 'daily',
    sessionDuration: 30,
    includesHomework: true,
    tutorPersonality: 'encouraging',
  });

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.PERSONALITY));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, STEPS.WELCOME));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await profileAPI.createOrUpdate({
        ...formData,
        targetLanguage: 'french',
      });
      navigate('/ai-intro');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
      setIsSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome! 👋</h1>
      <p className="text-xl text-gray-600">
        Your personal AI tutor, available 24/7
      </p>
      <p className="text-gray-600">
        Let's personalize your learning journey. This will take about 2 minutes.
      </p>
      <button onClick={handleNext} className="btn btn-primary px-8 py-3 text-lg">
        Let's Get Started
      </button>
    </div>
  );

  const renderLevelGoal = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Language & Level</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which language would you like to learn?
          </label>
          <div className="input bg-gray-100">French 🇫🇷</div>
          <p className="mt-1 text-xs text-gray-500">More languages coming soon!</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your current level?
          </label>
          <select
            value={formData.currentLevel}
            onChange={(e) => updateFormData({ currentLevel: e.target.value as any })}
            className="input"
          >
            <option value="beginner">Complete Beginner</option>
            <option value="A1">A1 - Elementary</option>
            <option value="A2">A2 - Pre-Intermediate</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Proficient</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your main goal?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'business_trip', label: '🏢 Business/Work', desc: 'Professional communication' },
              { value: 'tourism', label: '✈️ Travel/Tourism', desc: 'Navigate new places' },
              { value: 'conversation', label: '💬 Conversational Fluency', desc: 'Chat with natives' },
              { value: 'academic', label: '📚 Academic Study', desc: 'School or university' },
              { value: 'fluency', label: '🎯 General Fluency', desc: 'Complete mastery' },
            ].map((goal) => (
              <button
                key={goal.value}
                onClick={() => updateFormData({ learningGoal: goal.value as any })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.learningGoal === goal.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{goal.label}</div>
                <div className="text-sm text-gray-600">{goal.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="btn btn-secondary">
          Back
        </button>
        <button onClick={handleNext} className="btn btn-primary">
          Next
        </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule & Timeline</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How long do you want to reach your goal?
        </label>
        <select
          value={formData.timelineWeeks}
          onChange={(e) => updateFormData({ timelineWeeks: Number(e.target.value) })}
          className="input"
        >
          <option value={2}>2 weeks</option>
          <option value={4}>1 month</option>
          <option value={12}>3 months</option>
          <option value={24}>6 months</option>
          <option value={52}>1 year</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How often can you study?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'daily', label: '🔥 Daily', desc: '30-60 min' },
            { value: '3x_week', label: '📅 3x per week', desc: 'Regular practice' },
            { value: '2x_week', label: '📅 2x per week', desc: 'Steady pace' },
            { value: 'weekly', label: '🐌 Weekly', desc: 'Relaxed learning' },
          ].map((freq) => (
            <button
              key={freq.value}
              onClick={() => updateFormData({ studyFrequency: freq.value as any })}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.studyFrequency === freq.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{freq.label}</div>
              <div className="text-xs text-gray-600">{freq.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.includesHomework}
            onChange={(e) => updateFormData({ includesHomework: e.target.checked })}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-gray-700">I'll do homework between sessions</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button onClick={handleBack} className="btn btn-secondary">
          Back
        </button>
        <button onClick={handleNext} className="btn btn-primary">
          Next
        </button>
      </div>
    </div>
  );

  const renderPersonality = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your AI Tutor's Personality</h2>
      <p className="text-gray-600">You can change this anytime</p>

      <div className="grid grid-cols-1 gap-3">
        {[
          { value: 'encouraging', label: '😊 Encouraging & Supportive', desc: 'Positive and motivating' },
          { value: 'fun', label: '😄 Fun & Playful', desc: 'Makes learning enjoyable' },
          { value: 'detail_oriented', label: '🤓 Detail-Oriented & Thorough', desc: 'Precise and comprehensive' },
          { value: 'formal', label: '🎓 Formal & Academic', desc: 'Professional and structured' },
          { value: 'sarcastic', label: '😏 Sarcastic & Humorous', desc: 'Witty and entertaining' },
        ].map((personality) => (
          <button
            key={personality.value}
            onClick={() => updateFormData({ tutorPersonality: personality.value as any })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              formData.tutorPersonality === personality.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{personality.label}</div>
            <div className="text-sm text-gray-600">{personality.desc}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={handleBack} className="btn btn-secondary" disabled={isSubmitting}>
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );

  const steps = [
    { component: renderWelcome },
    { component: renderLevelGoal },
    { component: renderSchedule },
    { component: renderPersonality },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="card w-full max-w-2xl">
        {currentStep > STEPS.WELCOME && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {steps[currentStep].component()}
      </div>
    </div>
  );
}
