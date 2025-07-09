// Local storage utilities for form persistence
const STORAGE_KEY = 'latinos_business_form_data';

export const saveFormData = (data: any): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error);
  }
};

export const loadFormData = (): any => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error);
    return {};
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error);
  }
};