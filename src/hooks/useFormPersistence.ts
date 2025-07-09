import { useEffect } from 'react';
import { saveFormData, loadFormData } from '../utils/storage';

export const useFormPersistence = (formData: any, setFormData: (data: any) => void) => {
  // Load saved data on mount
  useEffect(() => {
    const savedData = loadFormData();
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
    }
  }, [setFormData]);

  // Save data whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormData(formData);
    }
  }, [formData]);
};