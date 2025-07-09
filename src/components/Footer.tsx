import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            © 2025 Latinos Business Support. All rights reserved. | Licensed & Insured
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            Developed by{' '}
            <a 
              href="https://lbs.bz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Latinos Business Support
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;