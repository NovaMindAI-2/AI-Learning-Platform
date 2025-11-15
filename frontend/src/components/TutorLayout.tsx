import { ReactNode } from 'react';

interface TutorLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

/**
 * Two-panel split-screen layout:
 * - Left (40%): AI Tutor visual and controls
 * - Right (60%): Learning content and exercises
 */
export default function TutorLayout({ leftPanel, rightPanel }: TutorLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-full px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">AI Language Learning Platform</h1>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - AI Tutor */}
        <div className="lg:w-2/5 bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
          {leftPanel}
        </div>

        {/* Right Panel - Content */}
        <div className="lg:w-3/5 bg-gray-50 overflow-y-auto">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
