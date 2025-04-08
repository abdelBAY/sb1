import React from 'react';
import { X, MapPin, Calendar, Tag, Star, Package } from 'lucide-react';

interface ImageOverlayProps {
  item: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    photos: string[];
    tags?: string[];
    created_at: string;
    condition: string;
    status: string;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    rating?: number;
    review_count?: number;
  };
  onClose: () => void;
}

export default function ImageOverlay({ item, onClose }: ImageOverlayProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 bg-white/10 rounded-full backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="w-full md:w-2/3 bg-gray-900">
            {item.photos && item.photos[0] ? (
              <img
                src={item.photos[0]}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 mt-2">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  {item.location}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  {formatDate(item.created_at)}
                </div>
                {item.dimensions && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Package className="w-5 h-5 mr-2" />
                    {`${item.dimensions.length}x${item.dimensions.width}x${item.dimensions.height} ${item.dimensions.unit}`}
                  </div>
                )}
              </div>

              {item.rating && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.rating.toFixed(1)}
                  </span>
                  {item.review_count && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      ({item.review_count} reviews)
                    </span>
                  )}
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.condition === 'LIKE_NEW'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : item.condition === 'GOOD'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : item.condition === 'WORN'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {item.condition}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : item.status === 'CLAIMED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}