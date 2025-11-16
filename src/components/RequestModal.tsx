import React, { useState } from 'react';
import { 
  MessageCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RequestModalProps {
  itemId: string;
  itemName: string;
  donorName: string;
  onClose: () => void;
  onSendRequest: (message: string) => void;
  seedBalance: number;
  seedEmptyMessage: string;
}

export default function RequestModal({ 
  itemId, 
  itemName, 
  donorName, 
  onClose, 
  onSendRequest,
  seedBalance,
  seedEmptyMessage,
}: RequestModalProps) {
  const [message, setMessage] = useState('Hi! I\'m interested in this item. Is it still available?');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('common');
  const helperCopy = t(
    'seeds.requestHelper',
    'Sending a new request costs 1 seed. You’ll earn more when you donate.'
  );

  const submitRequest = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    try {
      await onSendRequest(message.trim());
      onClose();
    } catch (error) {
      console.error('RequestModal error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1200]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send a Message to the Donor
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

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-3 resize-none"
                placeholder="Type your message here..."
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await submitRequest();
                }}
                disabled={!message.trim() || loading || (seedBalance ?? 0) < 1}
                className={`
                  flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                  transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                  shadow-md hover:shadow-lg
                  ${
                    !message.trim() || loading || (seedBalance ?? 0) < 1
                      ? 'bg-emerald-200 text-emerald-700 cursor-not-allowed opacity-70'
                      : 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white hover:from-emerald-600 hover:via-green-600 hover:to-lime-600 focus-visible:ring-emerald-400'
                  }
                `}
              >
                {loading ? t('seeds.sending', 'Sending...') : t('seeds.sendRequest', 'Send Request')}
              </button>
            </div>
            {(helperCopy || (seedBalance ?? 0) < 1) && (
              <div className="flex flex-col gap-1 text-right">
                {helperCopy && (
                  <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">
                    {helperCopy}
                  </p>
                )}
                {(seedBalance ?? 0) < 1 && (
                  <p className="text-sm rounded-lg bg-emerald-50/80 dark:bg-emerald-900/40 border border-emerald-100/80 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-200 px-3 py-2 font-medium">
                    {seedEmptyMessage}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
