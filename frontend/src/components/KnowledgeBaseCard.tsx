interface KnowledgeItem {
  id: string;
  content: string;
  knowledgeType: string;
  confidenceScore: number;
  timesPracticed: number;
}

interface KnowledgeBaseCardProps {
  items: KnowledgeItem[];
  onViewAll?: () => void;
}

export default function KnowledgeBaseCard({ items, onViewAll }: KnowledgeBaseCardProps) {
  const getConfidenceStars = (score: number) => {
    const stars = Math.round(score * 3); // 0-1 scale to 0-3 stars
    return '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vocabulary: 'bg-blue-100 text-blue-700',
      grammar: 'bg-green-100 text-green-700',
      phrase: 'bg-purple-100 text-purple-700',
      skill: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Knowledge Base</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No knowledge items yet</p>
          <p className="text-sm text-gray-400 mt-2">Start your first lesson to begin learning!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{item.content}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(item.knowledgeType)}`}>
                      {item.knowledgeType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{getConfidenceStars(item.confidenceScore)}</span>
                    <span>Practiced {item.timesPracticed}x</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
