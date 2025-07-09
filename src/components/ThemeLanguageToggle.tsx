import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeLanguageToggle: React.FC = () => {
  const { actualTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        title={actualTheme === 'light' ? t('theme.dark') : t('theme.light')}
      >
        {actualTheme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-200" />
        ) : (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-200" />
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {language === 'es' ? 'English' : 'Español'}
      </button>
    </div>
  );
};

export default ThemeLanguageToggle;