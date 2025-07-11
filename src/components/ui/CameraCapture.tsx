import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, RotateCcw, Download, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from './AnimatedCard';
import LoadingButton from './LoadingButton';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  maxPhotos?: number;
  quality?: number;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  maxPhotos = 10,
  quality = 0.8
}) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showError('Error de cámara', 'No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }, [facingMode, showError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `photo-${timestamp}.jpg`, { type: 'image/jpeg' });
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(blob);
        setCapturedPhotos(prev => [...prev, previewUrl]);
        
        onCapture(file);
        showSuccess('Foto capturada', 'La foto se ha guardado correctamente');
      }
    }, 'image/jpeg', quality);
  }, [onCapture, quality, showSuccess]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    // Clean up preview URLs
    capturedPhotos.forEach(url => URL.revokeObjectURL(url));
    onClose();
  }, [stopCamera, capturedPhotos, onClose]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  React.useEffect(() => {
    if (facingMode && !isStreaming) {
      startCamera();
    }
  }, [facingMode, isStreaming, startCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-4xl max-h-screen bg-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-semibold">Capturar Fotos</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{capturedPhotos.length}/{maxPhotos}</span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                aria-label="Cerrar cámara"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-center justify-center space-x-6">
            {/* Switch Camera */}
            <button
              onClick={switchCamera}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              aria-label="Cambiar cámara"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              disabled={capturedPhotos.length >= maxPhotos}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              aria-label="Capturar foto"
            >
              <Camera className="h-8 w-8 text-gray-800" />
            </button>

            {/* Done Button */}
            <button
              onClick={handleClose}
              className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition-colors text-white"
              aria-label="Finalizar"
            >
              <Check className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Photo Preview Strip */}
        {capturedPhotos.length > 0 && (
          <div className="absolute right-4 top-20 bottom-20 w-20 overflow-y-auto">
            <div className="space-y-2">
              {capturedPhotos.map((url, index) => (
                <AnimatedCard key={index} delay={index * 100} direction="right">
                  <img
                    src={url}
                    alt={`Captured ${index + 1}`}
                    className="w-full h-16 object-cover rounded border-2 border-white/50"
                  />
                </AnimatedCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;