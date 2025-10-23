import React, { useState } from 'react';
import { 
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FeedbackModalProps {
  itemName: string;
  donorName: string;
  onClose: () => void;
  onSubmitFeedback: (rating: 'positive' | 'neutral' | 'negative', comment: string) => void;
}

export default function FeedbackModal({ 
  itemName, 
  donorName, 
  onClose, 
  onSubmitFeedback 
}: FeedbackModalProps) {
  const [rating, setRating] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmitFeedback(rating, comment.trim());
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const getRatingInfo = (ratingType: 'positive' | 'neutral' | 'negative') => {
    switch (ratingType) {
      case 'positive':
        return {
          icon: ThumbsUp,
          color: 'green',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-800',
          hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30'
        };
      case 'neutral':
        return {
          icon: MessageSquare,
          color: 'yellow',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          hoverColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
        };
      case 'negative':
        return {
          icon: ThumbsDown,
          color: 'red',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-800',
          hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              How was your experience?
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Item:</strong> {itemName}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Donor:</strong> {donorName}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rate your experience:
              </label>
              <div className="grid grid-cols-1 gap-3">
                {(['positive', 'neutral', 'negative'] as const).map((ratingType) => {
                  const info = getRatingInfo(ratingType);
                  const Icon = info.icon;
                  const isSelected = rating === ratingType;
                  
                  return (
                    <button
                      key={ratingType}
                      type="button"
                      onClick={() => setRating(ratingType)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? `${info.bgColor} ${info.borderColor} border-2` 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      } ${info.hoverColor}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${isSelected ? info.textColor : 'text-gray-400 dark:text-gray-500'}`} />
                        <div className="text-left">
                          <div className={`font-medium capitalize ${isSelected ? info.textColor : 'text-gray-900 dark:text-white'}`}>
                            {ratingType}
                          </div>
                          <div className={`text-sm ${isSelected ? info.textColor : 'text-gray-500 dark:text-gray-400'}`}>
                            {ratingType === 'positive' && 'Great experience, would recommend'}
                            {ratingType === 'neutral' && 'Average experience, no major issues'}
                            {ratingType === 'negative' && 'Poor experience, had issues'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3 resize-none"
                placeholder="Share more details about your experience..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip Feedback
              </button>
              <button
                type="submit"
                disabled={loading || !rating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
