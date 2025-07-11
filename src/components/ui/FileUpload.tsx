import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image, Camera } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import CameraCapture from './CameraCapture';
import AnimatedCard from './AnimatedCard';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileSelect: (files: File[]) => void;
  selectedFiles?: File[];
  onFileRemove?: (index: number) => void;
  title?: string;
  description?: string;
  className?: string;
  allowCamera?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "*/*",
  multiple = false,
  maxSize = 10,
  onFileSelect,
  selectedFiles = [],
  onFileRemove,
  title = "Subir archivos",
  description = "Arrastra y suelta o haz clic para buscar",
  className = "",
  allowCamera = false
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`${t('file.file_error')} ${file.name} ${t('file.too_large')} ${maxSize}MB.`);
      return false;
    }
    return true;
  };

  const handleFiles = (files: FileList) => {
    setError('');
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCameraCapture = (file: File) => {
    if (validateFile(file)) {
      onFileSelect([file]);
    }
    setShowCamera(false);
  };

  return (
    <div className={`${className} relative`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${title}. ${description}`}
      >
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <h4 className="text-md font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 mb-3">{description}</p>
        
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-describedby="file-upload-description"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('button.upload_files')}
            </button>
            
            {allowCamera && accept.includes('image') && (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
              >
                <Camera className="h-4 w-4 mr-2" />
                Usar Cámara
              </button>
            )}
          </div>
        </div>
        
        <p id="file-upload-description" className="text-xs text-gray-500 mt-2">
          {t('file.max_size')} {maxSize}MB {t('file.per_file')}
        </p>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2" role="alert">
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white">{t('file.selected_files')}</h5>
          <div className="grid grid-cols-1 gap-2">
            {selectedFiles.map((file, index) => (
              <AnimatedCard key={index} delay={index * 100} direction="up" hover={true}>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {onFileRemove && (
                    <button
                      onClick={() => onFileRemove(index)}
                      aria-label={`Eliminar archivo ${file.name}`}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}
      
      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          maxPhotos={multiple ? 10 : 1}
        />
      )}
    </div>
  );
};

export default FileUpload;