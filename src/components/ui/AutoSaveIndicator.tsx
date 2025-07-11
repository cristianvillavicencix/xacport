import React from 'react';
import { Save, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAutoSave } from '../../hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  data: any;
  className?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ data, className = '' }) => {
  const { lastSaved, isSaving, hasUnsavedChanges, forceSave } = useAutoSave({
    data,
    interval: 30000, // 30 seconds
    enabled: true
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    if (isSaving) {
      return <Save className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (hasUnsavedChanges) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    if (lastSaved) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isSaving) {
      return 'Guardando...';
    }
    if (hasUnsavedChanges) {
      return 'Cambios sin guardar';
    }
    if (lastSaved) {
      return `Guardado a las ${formatTime(lastSaved)}`;
    }
    return 'Sin guardar';
  };

  const getStatusColor = () => {
    if (isSaving) {
      return 'text-blue-600 dark:text-blue-400';
    }
    if (hasUnsavedChanges) {
      return 'text-amber-600 dark:text-amber-400';
    }
    if (lastSaved) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={`text-xs ${getStatusColor()} transition-colors duration-200`}>
          {getStatusText()}
        </span>
      </div>
      
      {hasUnsavedChanges && !isSaving && (
        <button
          onClick={forceSave}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200 underline"
        >
          Guardar ahora
        </button>
      )}
    </div>
  );
};

export default AutoSaveIndicator;