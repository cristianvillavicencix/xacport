import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  pulse = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-blue-600 hover:shadow-lg hover:shadow-blue-500/25';
      case 'secondary':
        return 'bg-gray-400 hover:bg-gray-500 focus:ring-gray-500 text-white border-gray-400 hover:shadow-lg hover:shadow-gray-500/25';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-green-600 hover:shadow-lg hover:shadow-green-500/25';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-red-600 hover:shadow-lg hover:shadow-red-500/25';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white border-blue-600 hover:shadow-lg hover:shadow-blue-500/25';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={loading ? 'Cargando...' : undefined}
      aria-disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-lg border
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transform hover:scale-105 active:scale-95
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed transform-none' 
          : 'hover:shadow-lg'
        }
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {loading && (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
      )}
      
      {!loading && icon && (
        <span className="mr-2 transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{icon}</span>
      )}
      
      <span className={`transition-opacity duration-200 ${loading ? 'opacity-75' : ''}`}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;