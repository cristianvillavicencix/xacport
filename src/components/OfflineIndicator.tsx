import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showOffline, setShowOffline] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
    } else {
      // Ocultar después de 2 segundos cuando vuelve la conexión
      const timer = setTimeout(() => {
        setShowOffline(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showOffline) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto transition-all duration-300 ${
      isOnline ? 'transform translate-y-0' : 'transform translate-y-0'
    }`}>
      <div className={`${
        isOnline 
          ? 'bg-green-500' 
          : 'bg-red-500'
      } text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2`}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Conexión restaurada' : 'Sin conexión a internet'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;