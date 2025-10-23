import React from 'react';
import { 
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface RequestStatusProps {
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  donorName: string;
  onOpenChat: () => void;
}

export default function RequestStatus({ status, donorName, onOpenChat }: RequestStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'yellow',
          title: 'Pending',
          description: 'Waiting for donor\'s reply',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          color: 'green',
          title: 'Accepted',
          description: 'Donor has accepted your request',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'declined':
        return {
          icon: XCircle,
          color: 'red',
          title: 'Declined',
          description: 'Donor has declined your request',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'blue',
          title: 'Completed',
          description: 'Request has been completed',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'gray',
          title: 'Unknown',
          description: 'Unknown status',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-800 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className={`border rounded-lg p-4 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-6 h-6 ${statusInfo.textColor}`} />
        <div className="flex-1">
          <h3 className={`font-medium ${statusInfo.textColor}`}>
            Status: {statusInfo.title}
          </h3>
          <p className={`text-sm ${statusInfo.textColor} opacity-80`}>
            {statusInfo.description}
          </p>
          {status === 'pending' && (
            <p className={`text-sm ${statusInfo.textColor} opacity-80 mt-1`}>
              You can message {donorName} anytime through the chat below.
            </p>
          )}
        </div>
        {(status === 'pending' || status === 'accepted') && (
          <button
            onClick={onOpenChat}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Open Chat
          </button>
        )}
      </div>
    </div>
  );
}
