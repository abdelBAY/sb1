import React from 'react';
import { X, Plug } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountType?: string;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, accountType = 'account' }: LogoutModalProps) {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Wall Socket */}
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center border-2 border-gray-900 dark:border-gray-100">
                <div className="w-12 h-12 flex flex-col items-center justify-center space-y-1">
                  <div className="w-8 h-1.5 bg-gray-900 dark:bg-gray-100 rounded"></div>
                  <div className="w-8 h-1.5 bg-gray-900 dark:bg-gray-100 rounded"></div>
                  <div className="w-8 h-1.5 bg-gray-900 dark:bg-gray-100 rounded"></div>
                </div>
              </div>
              {/* Disconnected Plug */}
              <div className="absolute -top-1 -right-1 w-14 h-14 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center border-2 border-gray-900 dark:border-gray-100 transform rotate-12 shadow-lg">
                <Plug className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {t('logout.title', { defaultValue: 'Logout' })}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {t('logout.message', { account: accountType, defaultValue: `You will be logged out of your account: ${accountType}` })}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {t('logout.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {t('logout.confirm', { defaultValue: 'OK' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

