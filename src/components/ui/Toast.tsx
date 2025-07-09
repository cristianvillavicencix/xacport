import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-close timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Handle Escape key for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-700 dark:text-green-300'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-700 dark:text-red-300'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-700 dark:text-yellow-300'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-800 dark:text-blue-200',
          messageColor: 'text-blue-700 dark:text-blue-300'
        };
    }
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm w-full sm:w-auto
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full sm:translate-x-full opacity-0 scale-95'
        }
      `}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby={`toast-title-${id}`}
      aria-describedby={message ? `toast-message-${id}` : undefined}
    >
      <div className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-lg shadow-lg p-4
        backdrop-blur-sm
      `}>
        <div className="flex items-start space-x-3">
          <IconComponent 
            className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <h4 
              id={`toast-title-${id}`}
              className={`text-sm font-medium ${config.titleColor}`}
            >
              {title}
            </h4>
            {message && (
              <p 
                id={`toast-message-${id}`}
                className={`text-sm mt-1 ${config.messageColor}`}
              >
                {message}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Cerrar notificación"
            className={`
              ${config.iconColor} hover:opacity-70 
              transition-opacity duration-200 flex-shrink-0
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;