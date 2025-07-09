import { useState, useCallback } from 'react';
import { trackError } from '../utils/analytics';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  const captureError = useCallback((error: Error, errorInfo?: any) => {
    setErrorState({
      hasError: true,
      error,
      errorInfo
    });

    // Track the error
    trackError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  return {
    ...errorState,
    captureError,
    resetError
  };
};