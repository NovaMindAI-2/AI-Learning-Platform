interface LessonCardProps {
  lessonNumber: number;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  objectives?: string[];
  onStart?: () => void;
}

export default function LessonCard({
  lessonNumber,
  title,
  description,
  duration,
  completed,
  objectives,
  onStart
}: LessonCardProps) {
  return (
    <div className={`card ${completed ? 'bg-green-50 border-2 border-green-200' : 'border-2 border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-600">Lesson {lessonNumber}</span>
            {completed && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                ✓ Completed
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{duration} min</span>
      </div>

      <p className="text-gray-700 mb-4">{description}</p>

      {objectives && objectives.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">What you'll learn:</p>
          <ul className="space-y-1">
            {objectives.slice(0, 3).map((objective, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onStart && !completed && (
        <button onClick={onStart} className="btn btn-primary w-full">
          Start Lesson
        </button>
      )}

      {completed && (
        <button className="btn btn-secondary w-full">
          Review Lesson
        </button>
      )}
    </div>
  );
}
