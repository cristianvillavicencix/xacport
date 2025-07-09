import React, { useState, useRef, useEffect } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  hover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'fade',
  hover = false
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
    if (!isVisible) {
      return 'opacity-0';
    }
    return 'opacity-100';
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    return 'hover:shadow-md transition-shadow duration-200';
  };

  return (
    <div
      ref={cardRef}
      className={`
        transition-opacity duration-500 ease-out
        ${getTransformClasses()}
        ${getHoverClasses()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;