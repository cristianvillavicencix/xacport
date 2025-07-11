import React, { useState, useRef, useEffect } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  hover?: boolean;
  scale?: boolean;
  bounce?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'fade',
  hover = false,
  scale = false,
  bounce = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransformClasses = () => {
    const baseTransition = 'transition-all duration-700 ease-out';
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `opacity-0 transform translate-y-8 ${baseTransition}`;
        case 'down':
          return `opacity-0 transform -translate-y-8 ${baseTransition}`;
        case 'left':
          return `opacity-0 transform translate-x-8 ${baseTransition}`;
        case 'right':
          return `opacity-0 transform -translate-x-8 ${baseTransition}`;
        default:
          return `opacity-0 transform scale-95 ${baseTransition}`;
      }
    }
    
    return `opacity-100 transform translate-x-0 translate-y-0 scale-100 ${baseTransition}`;
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    let hoverClass = 'hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300';
    
    if (scale) {
      hoverClass += ' hover:scale-105';
    }
    
    if (bounce) {
      hoverClass += ' hover:animate-pulse';
    }
    
    return hoverClass;
  };

  const getAnimationClasses = () => {
    if (!isVisible) return '';
    
    let animationClass = '';
    if (bounce) {
      animationClass += ' animate-bounce-subtle';
    }
    
    return animationClass;
  };

  return (
    <div
      ref={cardRef}
      className={`
        ${getTransformClasses()}
        ${getHoverClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;