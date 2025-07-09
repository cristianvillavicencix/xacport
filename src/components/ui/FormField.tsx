import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  showValidation?: boolean;
  autoComplete?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  icon,
  disabled = false,
  className = '',
  showValidation = true,
  autoComplete
}) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${fieldId}-error`;

  const validateField = (val: string): string => {
    if (validation?.required && !val.trim()) {
      return 'Este campo es requerido';
    }

    if (validation?.minLength && val.length < validation.minLength) {
      return `Mínimo ${validation.minLength} caracteres`;
    }

    if (validation?.maxLength && val.length > validation.maxLength) {
      return `Máximo ${validation.maxLength} caracteres`;
    }

    if (validation?.pattern && !validation.pattern.test(val)) {
      switch (type) {
        case 'email':
          return 'Formato de email inválido';
        case 'tel':
          return 'Formato de teléfono inválido';
        case 'url':
          return 'Formato de URL inválido';
        default:
          return 'Formato inválido';
      }
    }

    if (validation?.custom) {
      const customError = validation.custom(val);
      if (customError) return customError;
    }

    return '';
  };

  useEffect(() => {
    if (touched || value) {
      const errorMsg = validateField(value);
      setError(errorMsg);
      setIsValid(!errorMsg && value.length > 0);
    }
  }, [value, touched, validation]);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const getInputClasses = () => {
    let classes = `
      w-full px-3 py-2 border rounded-md 
      focus:outline-none focus:ring-2 focus:border-transparent
      transition-all duration-200
      ${icon ? 'pl-10' : ''}
      ${type === 'password' ? 'pr-10' : ''}
      ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700'}
      text-gray-900 dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
    `;

    if (touched && showValidation) {
      if (error) {
        classes += ' border-red-500 focus:ring-red-500 dark:border-red-400';
      } else if (isValid) {
        classes += ' border-green-500 focus:ring-green-500 dark:border-green-400';
      } else {
        classes += ' border-gray-300 dark:border-gray-500 focus:ring-blue-500';
      }
    } else {
      classes += ' border-gray-300 dark:border-gray-500 focus:ring-blue-500';
    }

    return classes;
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {validation?.required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-gray-400" aria-hidden="true">
            {icon}
          </div>
        )}
        
        <input
          id={fieldId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={getInputClasses()}
          aria-invalid={touched && !!error}
          aria-describedby={error ? errorId : undefined}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}

        {touched && showValidation && (
          <div className="absolute right-3 top-2.5" aria-hidden="true">
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {touched && error && showValidation && (
        <div id={errorId} className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400" role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {touched && isValid && showValidation && (
        <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          <span>Campo válido</span>
        </div>
      )}
    </div>
  );
};

export default FormField;