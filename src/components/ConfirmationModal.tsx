import React, { useState } from 'react';
import { 
  CheckCircle,
  Calendar,
  MapPin,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ConfirmationModalProps {
  itemName: string;
  donorName: string;
  suggestedDate?: string;
  suggestedPlace?: string;
  onClose: () => void;
  onConfirmMeeting: (date: string, place: string) => void;
  onCancelRequest: () => void;
}

export default function ConfirmationModal({ 
  itemName, 
  donorName, 
  suggestedDate, 
  suggestedPlace, 
  onClose, 
  onConfirmMeeting, 
  onCancelRequest 
}: ConfirmationModalProps) {
  const [meetingDate, setMeetingDate] = useState(suggestedDate || '');
  const [meetingPlace, setMeetingPlace] = useState(suggestedPlace || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !meetingPlace.trim()) {
      setError('Please fill in both date and place');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirmMeeting(meetingDate, meetingPlace.trim());
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to confirm meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    try {
      await onCancelRequest();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Request Accepted!
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Item:</strong> {itemName}
            </p>
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Donor:</strong> {donorName}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please confirm pickup details:
          </p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleConfirmMeeting} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Place <span className="text-red-500">*</span>
              </label>
              <textarea
                value={meetingPlace}
                onChange={(e) => setMeetingPlace(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3 resize-none"
                placeholder="Enter meeting location (e.g., Starbucks on Main Street, City Center Mall entrance, etc.)"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Safety reminder:</strong> Remember to meet in a public area for your safety.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancelRequest}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel Request
              </button>
              <button
                type="submit"
                disabled={loading || !meetingDate || !meetingPlace.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Meeting
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
