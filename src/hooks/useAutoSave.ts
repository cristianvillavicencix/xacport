import { useEffect, useRef, useState } from 'react';
import { saveFormData } from '../utils/storage';

interface UseAutoSaveOptions {
  data: any;
  interval?: number; // milliseconds
  enabled?: boolean;
  onSave?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAutoSave = ({
  data,
  interval = 30000, // 30 seconds default
  enabled = true,
  onSave,
  onError
}: UseAutoSaveOptions) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastDataRef = useRef<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveData = async () => {
    if (!enabled || isSaving) return;

    const currentDataString = JSON.stringify(data);
    
    // Only save if data has changed
    if (currentDataString === lastDataRef.current) {
      return;
    }

    setIsSaving(true);
    
    try {
      saveFormData(data);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastDataRef.current = currentDataString;
      onSave?.(data);
    } catch (error) {
      console.error('Auto-save failed:', error);
      onError?.(error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  // Manual save function
  const forceSave = () => {
    saveData();
  };

  // Track data changes
  useEffect(() => {
    const currentDataString = JSON.stringify(data);
    if (currentDataString !== lastDataRef.current && lastDataRef.current !== '') {
      setHasUnsavedChanges(true);
    }
  }, [data]);

  // Auto-save interval
  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      saveData();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, interval, enabled]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        saveData();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasUnsavedChanges) {
        saveData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges]);

  return {
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    forceSave
  };
};