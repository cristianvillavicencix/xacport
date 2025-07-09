import React from 'react';
import { useState } from 'react';
import { FileText, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeLanguageToggle from './ThemeLanguageToggle';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200" role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png" 
              alt="LBS Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">{t('header.title')}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{t('header.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="h-4 w-4" />
                <span className="truncate">+1 203 303 9148</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Mail className="h-4 w-4" />
                <span className="truncate">info@lbs.bz</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Globe className="h-4 w-4" />
                <span className="truncate">lbs.bz</span>
              </div>
            </div>
            
            <ThemeLanguageToggle />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-200">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+12033039148" className="hover:text-gray-900 dark:hover:text-blue-400">+1 203 303 9148</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@lbs.bz" className="hover:text-gray-900 dark:hover:text-blue-400">info@lbs.bz</a>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <a href="https://lbs.bz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-blue-400">lbs.bz</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;