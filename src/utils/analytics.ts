// Analytics and error tracking utilities

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
}

// Track user interactions
export const trackEvent = (event: AnalyticsEvent) => {
  // In production, this would send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
  
  // Example: Google Analytics 4
  // gtag('event', event.action, {
  //   event_category: event.category,
  //   event_label: event.label,
  //   value: event.value
  // });
};

// Track form interactions
export const trackFormEvent = (formName: string, action: string, field?: string) => {
  trackEvent({
    action,
    category: 'Form',
    label: field ? `${formName}_${field}` : formName
  });
};

// Track step progression
export const trackStepProgression = (currentStep: number, totalSteps: number, stepName: string) => {
  trackEvent({
    action: 'step_completed',
    category: 'User Journey',
    label: stepName,
    value: Math.round((currentStep / totalSteps) * 100)
  });
};

// Error tracking
export const trackError = (error: ErrorInfo, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error tracked:', error, context);
  }
  
  // In production, send to error tracking service like Sentry
  // Sentry.captureException(new Error(error.message), {
  //   extra: context,
  //   tags: {
  //     component: error.errorBoundary || 'unknown'
  //   }
  // });
};

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent({
    action: 'performance_metric',
    category: 'Performance',
    label: `${metric}_${unit}`,
    value: Math.round(value)
  });
};

// User session tracking
export const trackSession = (action: 'start' | 'end' | 'timeout') => {
  trackEvent({
    action: `session_${action}`,
    category: 'Session',
    label: new Date().toISOString()
  });
};