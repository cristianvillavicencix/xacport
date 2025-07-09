import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  steps, 
  className = '' 
}) => {
  const { t } = useLanguage();
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`mb-4 sm:mb-6 lg:mb-8 ${className}`} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      {/* Progress percentage bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 space-y-1 sm:space-y-0">
          <span>{t('progress.title')}</span>
          <span>{Math.round(progressPercentage)}% {t('progress.completed')}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            aria-label={`Progreso: ${Math.round(progressPercentage)}%`}
          />
        </div>
      </div>
      
      {/* Step indicators - responsive overflow handling */}
      <div className="overflow-x-auto pb-2 -mx-2 sm:mx-0">
        <div className="flex items-center justify-between min-w-max sm:min-w-0 mb-2 px-2 sm:px-0" style={{ minWidth: '600px' }}>
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-300 ${
                  index < currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-300'
                }`}
                aria-label={`Paso ${index + 1}: ${step} ${
                  index < currentStep ? '(completado)' : 
                  index === currentStep ? '(actual)' : '(pendiente)'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" aria-hidden="true" />
                ) : (
                  <span className="text-xs sm:text-sm lg:text-base font-medium">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-6 sm:w-8 lg:w-12 h-0.5 mx-1 sm:mx-2 transition-all duration-300 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step info */}
      <div className="text-center px-2 sm:px-0">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white leading-tight">
          {t('progress.step')} {currentStep + 1} {t('progress.of')} {steps.length}: {steps[currentStep]}
        </h2>
      </div>
    </div>
  );
};

export default ProgressIndicator;