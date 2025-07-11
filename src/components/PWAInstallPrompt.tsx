import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '../contexts/LanguageContext';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const { t } = useLanguage();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Mostrar el prompt después de 3 segundos
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img 
              src="https://yourfiles.cloud/uploads/fc5c58333bc9e1b2be4c3999d406e0bb/Untitled-1-3-removebg-preview.png" 
              alt="LBS Logo"
              className="h-10 w-10 rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Instalar LBS Estimados
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Accede más rápido desde tu pantalla de inicio
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={installApp}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                <Download className="h-3 w-3" />
                <span>Instalar</span>
              </button>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs px-2 py-1.5 transition-colors duration-200"
              >
                Ahora no
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;