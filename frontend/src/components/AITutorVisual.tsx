import { useState, useEffect } from 'react';

interface AITutorVisualProps {
  name?: string;
  status?: 'idle' | 'listening' | 'speaking' | 'thinking';
  personality?: string;
}

/**
 * AI Tutor visual component with animated circle
 * Shows different states: idle, listening, speaking, thinking
 */
export default function AITutorVisual({
  name = 'Amélie',
  status = 'idle',
  personality = 'encouraging'
}: AITutorVisualProps) {
  const [pulseScale, setPulseScale] = useState(1);

  // Animate based on status
  useEffect(() => {
    if (status === 'speaking') {
      const interval = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.1 : 1);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setPulseScale(1);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'from-green-400 to-green-600';
      case 'speaking':
        return 'from-primary-400 to-primary-600';
      case 'thinking':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-purple-400 to-purple-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'speaking':
        return 'Speaking...';
      case 'thinking':
        return 'Thinking...';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
      {/* Animated Circle */}
      <div
        className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center transition-all duration-500 shadow-2xl`}
        style={{ transform: `scale(${pulseScale})` }}
      >
        {/* Inner circle */}
        <div className="w-40 h-40 rounded-full bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
          {/* Voice wave visualization (simplified) */}
          {status === 'speaking' && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 30}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Microphone icon for listening */}
          {status === 'listening' && (
            <svg className="w-16 h-16 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}

          {/* Idle/Thinking state */}
          {(status === 'idle' || status === 'thinking') && (
            <div className="text-6xl">
              {status === 'thinking' ? '🤔' : '🎓'}
            </div>
          )}
        </div>

        {/* Outer glow ring */}
        {status === 'speaking' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-30 animate-ping" />
        )}
      </div>

      {/* Tutor Name */}
      <h2 className="text-3xl font-bold mt-6">{name}</h2>

      {/* Status Text */}
      <p className="text-lg text-gray-300 mt-2">{getStatusText()}</p>

      {/* Personality Badge */}
      <div className="mt-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
        <p className="text-sm text-gray-200 capitalize">
          {personality.replace('_', ' ')} Tutor
        </p>
      </div>
    </div>
  );
}
