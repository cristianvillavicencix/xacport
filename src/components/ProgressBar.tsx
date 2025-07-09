import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  const { t } = useLanguage();
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      {/* Progress percentage bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{t('progress.title')}</span>
          <span>{Math.round(progressPercentage)}% {t('progress.completed')}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              index < currentStep 
                ? 'bg-green-500 border-green-500 text-white' 
                : index === currentStep 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('progress.step')} {currentStep + 1} {t('progress.of')} {steps.length}: {steps[currentStep]}
        </h2>
      </div>
    </div>
  );
};

export default ProgressBar;