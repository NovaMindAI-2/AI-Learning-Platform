import { useState } from 'react';

interface VoiceControlsProps {
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  onInterrupt?: () => void;
  isMuted?: boolean;
  volume?: number;
}

/**
 * Voice controls for the AI tutor
 */
export default function VoiceControls({
  onToggleMute,
  onVolumeChange,
  onInterrupt,
  isMuted = false,
  volume = 80
}: VoiceControlsProps) {
  const [localVolume, setLocalVolume] = useState(volume);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setLocalVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Microphone Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-white text-sm">Microphone</span>
        <button
          onClick={onToggleMute}
          className={`p-3 rounded-full transition-all ${
            isMuted
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isMuted ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Volume</span>
          <span className="text-white text-sm">{localVolume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={localVolume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Interrupt Button */}
      <button
        onClick={onInterrupt}
        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
      >
        Stop Speaking
      </button>

      {/* Connection Status */}
      <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-gray-400">Connected</span>
      </div>
    </div>
  );
}
