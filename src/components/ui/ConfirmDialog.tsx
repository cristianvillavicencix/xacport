import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  const colors = colorClasses[type];

  // Handle Escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Focus management
    const previousActiveElement = document.activeElement as HTMLElement;
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    if (dialog) {
      dialog.focus();
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onCancel]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className={`${colors.bg} ${colors.border} rounded-lg p-4 mb-4`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`h-6 w-6 ${colors.icon} mt-0.5 flex-shrink-0`} />
              <div>
                <h3 id="dialog-title" className="font-medium text-gray-900 dark:text-white">{title}</h3>
                <p id="dialog-description" className="text-sm text-gray-700 dark:text-gray-300 mt-1">{message}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${colors.button} text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;