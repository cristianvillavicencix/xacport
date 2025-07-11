import React, { useState } from 'react';
import { Upload, FileText, DollarSign, Camera, Link, X } from 'lucide-react';
import FileUpload from '../ui/FileUpload';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingButton from '../ui/LoadingButton';

interface MeasurementsPhotosProps {
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const MeasurementsPhotos: React.FC<MeasurementsPhotosProps> = ({ onNext, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Measurements state
  const [provideMeasurements, setProvideMeasurements] = useState<boolean | null>(null);
  const [measurementFile, setMeasurementFile] = useState<File | null>(null);
  const [measurementType, setMeasurementType] = useState<string | null>(null);
  
  // Photos state
  const [photoMethod, setPhotoMethod] = useState<string | null>(null);
  const [companyCamLink, setCompanyCamLink] = useState('');
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleNext();
    }
  };

  const isFormValid = () => {
    const measurementsValid = provideMeasurements !== null && 
      (provideMeasurements === true ? measurementFile !== null : measurementType !== null);
    const photosValid = photoMethod !== null && 
      (photoMethod === 'none' || 
       (photoMethod === 'companycam' && companyCamLink) ||
       (photoMethod === 'googledrive' && googleDriveLink) ||
       (photoMethod === 'upload' && uploadedFiles.length > 0));
    
    return measurementsValid && photosValid;
  };

  const handleMeasurementFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setMeasurementFile(selectedFile);
    }
  };

  const handlePhotoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removePhotoFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!isFormValid()) {
      showError('Información incompleta', 'Por favor completa la configuración de medidas y fotos');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setFormData({ 
        ...formData, 
        provideMeasurements, 
        measurementFile,
        measurementType,
        photoMethod,
        companyCamLink,
        googleDriveLink,
        uploadedFiles
      });
      
      showSuccess('Configuración guardada', 'Medidas y fotos configuradas correctamente');
      setIsLoading(false);
      onNext();
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('measurements.title')}</h3>
        <p className="text-gray-600 mb-6">
          {t('measurements.subtitle')}
        </p>

        <div className="space-y-8">
          {/* Measurements Section */}
          <AnimatedCard delay={100} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              {t('measurements.section_title')}
            </h4>
            <p className="text-gray-600 mb-4">
              {t('measurements.section_desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <AnimatedCard delay={150} direction="left" hover={true}>
                <button
                  onClick={() => setProvideMeasurements(true)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 w-full ${
                    provideMeasurements === true 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <FileText className="h-6 w-6 text-amber-600 mb-2" />
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">{t('measurements.provide_yes')}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('measurements.provide_yes_desc')}</p>
                  </div>
                </button>
              </AnimatedCard>

              <AnimatedCard delay={200} direction="right" hover={true}>
                <button
                  onClick={() => setProvideMeasurements(false)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 w-full ${
                    provideMeasurements === false 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">{t('measurements.provide_no')}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('measurements.provide_no_desc')}</p>
                    <p className="text-xs text-blue-600 mt-1">{t('measurements.provide_no_price')}</p>
                  </div>
                </button>
              </AnimatedCard>
            </div>

            {provideMeasurements === true && (
              <AnimatedCard delay={250} direction="up">
                <FileUpload
                  accept=".pdf"
                  multiple={false}
                  maxSize={25}
                  onFileSelect={(files) => setMeasurementFile(files[0])}
                  selectedFiles={measurementFile ? [measurementFile] : []}
                  onFileRemove={() => setMeasurementFile(null)}
                  title={t('measurements.upload_title')}
                  description={t('measurements.upload_desc')}
                  className="mb-6"
                />
              </AnimatedCard>
            )}

            {provideMeasurements === false && (
              <AnimatedCard delay={250} direction="up" className="mb-6">
                <h5 className="font-medium text-gray-900 mb-4">{t('measurements.type_question')}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMeasurementType('full')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      measurementType === 'full' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="h-6 w-6 text-green-600 mb-2" />
                    <div className="text-left">
                      <h6 className="font-medium text-gray-900">{t('measurements.type_full')}</h6>
                      <p className="text-sm text-gray-600">{t('measurements.type_full_desc')}</p>
                      <p className="text-xs text-green-600 mt-1">{t('measurements.type_full_price')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setMeasurementType('roof')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      measurementType === 'roof' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-left">
                      <h6 className="font-medium text-gray-900">{t('measurements.type_roof')}</h6>
                      <p className="text-sm text-gray-600">{t('measurements.type_roof_desc')}</p>
                      <p className="text-xs text-blue-600 mt-1">{t('measurements.type_roof_price')}</p>
                    </div>
                  </button>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h6 className="font-medium text-yellow-800">{t('measurements.cost_info')}</h6>
                      <p className="text-sm text-yellow-700 mt-1">
                        {measurementType === 'full' 
                          ? t('measurements.cost_full_desc')
                          : measurementType === 'roof'
                          ? t('measurements.cost_roof_desc')
                          : t('measurements.cost_select')
                        }
                      </p>
                      {measurementType === 'full' && (
                        <div className="mt-2">
                          <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add download link for measurement guide
                              alert('Guía de medidas completas - Enlace pendiente');
                            }}
                          >
                            {t('measurements.guide_download')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            )}
          </AnimatedCard>

          {/* Photos Section */}
          <AnimatedCard delay={300} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-green-600" />
              {t('measurements.photos_title')}
            </h4>
            <p className="text-gray-600 mb-4">
              {t('measurements.photos_desc')}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {t('measurements.photos_tip')}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h5 className="font-medium text-gray-900">{t('measurements.photos_method')}</h5>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photoMethod"
                    value="companycam"
                    checked={photoMethod === 'companycam'}
                    onChange={(e) => setPhotoMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{t('measurements.photos_companycam')}</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photoMethod"
                    value="googledrive"
                    checked={photoMethod === 'googledrive'}
                    onChange={(e) => setPhotoMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{t('measurements.photos_googledrive')}</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photoMethod"
                    value="upload"
                    checked={photoMethod === 'upload'}
                    onChange={(e) => setPhotoMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{t('measurements.photos_upload')}</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photoMethod"
                    value="none"
                    checked={photoMethod === 'none'}
                    onChange={(e) => setPhotoMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-gray-700">{t('measurements.photos_none')}</span>
                </label>
              </div>
            </div>

            {photoMethod === 'companycam' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('measurements.companycam_link')}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder={t('measurements.companycam_placeholder')}
                    value={companyCamLink}
                    onChange={(e) => setCompanyCamLink(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Link className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            {photoMethod === 'googledrive' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('measurements.googledrive_link')}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder={t('measurements.googledrive_placeholder')}
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Link className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}

            {photoMethod === 'upload' && (
              <FileUpload
                accept="image/*"
                multiple={true}
                maxSize={10}
                onFileSelect={(files) => setUploadedFiles([...uploadedFiles, ...files])}
                selectedFiles={uploadedFiles}
                onFileRemove={removePhotoFile}
                title={t('measurements.upload_photos_title')}
                description={t('measurements.upload_photos_desc')}
                className="mb-6"
                allowCamera={true}
                allowCamera={false}
              />
            )}
          </AnimatedCard>
        </div>

        <div className="flex space-x-4 mt-6">
          <LoadingButton
            onClick={onPrev}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            {t('button.back')}
          </LoadingButton>
          <LoadingButton
            onClick={handleNext}
            loading={isLoading}
            disabled={!isFormValid()}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            {t('button.continue')}
          </LoadingButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default MeasurementsPhotos;