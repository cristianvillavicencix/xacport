import React, { useState, useEffect } from 'react';

interface StepTransitionProps {
  children: React.ReactNode;
  currentStep: number;
  direction?: 'forward' | 'backward';
}

const StepTransition: React.FC<StepTransitionProps> = ({ 
  children, 
  currentStep, 
  direction = 'forward' 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStep, setDisplayStep] = useState(currentStep);

  useEffect(() => {
    if (currentStep !== displayStep) {
      setIsTransitioning(true);
      
      // Scroll to top when step changes
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => {
        setDisplayStep(currentStep);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  }, [currentStep, displayStep]);

  const getTransitionClasses = () => {
    if (!isTransitioning) {
      return 'opacity-100 transform translate-x-0';
    }
    
    const translateClass = direction === 'forward' 
      ? '-translate-x-full' 
      : 'translate-x-full';
    
    return `opacity-0 transform ${translateClass}`;
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`
        transition-all duration-300 ease-in-out
        ${getTransitionClasses()}
      `}>
        {children}
      </div>
    </div>
  );
};

export default StepTransition;