import { useEffect } from 'react';

export const useAutoScroll = (currentStep: number) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
};