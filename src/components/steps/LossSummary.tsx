import React, { useState } from 'react';
import { Upload, FileText, RefreshCw, Settings } from 'lucide-react';
import FileUpload from '../ui/FileUpload';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingButton from '../ui/LoadingButton';

interface LossSummaryProps {
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const LossSummary: React.FC<LossSummaryProps> = ({ onNext, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [hasExistingScope, setHasExistingScope] = useState<boolean | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('xactimate');
  const [file, setFile] = useState<File | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<boolean | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleNext();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData({ ...formData, existingScopeFile: selectedFile });
    }
  };

  const handleAdditionalFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAdditionalFiles([...additionalFiles, ...files]);
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(additionalFiles.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    if (hasExistingScope === null) return false;
    if (hasExistingScope === true && !file) return false;
    if (hasExistingScope === true && additionalDocuments === null) return false;
    return true;
  };

  const handleNext = () => {
    if (!isFormValid()) {
      showError('Información incompleta', 'Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setFormData({ 
        ...formData, 
        hasExistingScope, 
        selectedFormat,
        existingScopeFile: file,
        additionalDocuments,
        additionalFiles
      });
      
      showSuccess(
        hasExistingScope ? 'Scope cargado' : 'Configuración guardada',
        hasExistingScope ? 'Tu scope ha sido procesado correctamente' : 'Procederemos a crear tu scope personalizado'
      );
      
      setIsLoading(false);
      onNext();
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('loss.title')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('loss.subtitle')}
        </p>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <legend className="sr-only">Tipo de scope</legend>
          
          <div>
            <button
              onClick={() => setHasExistingScope(true)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                hasExistingScope === true 
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              aria-pressed={hasExistingScope === true}
              aria-describedby="existing-scope-desc"
            >
              <FileText className="h-6 w-6 text-amber-600 mb-2" aria-hidden="true" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{t('loss.have_scope')}</h4>
                <p id="existing-scope-desc" className="text-sm text-gray-600 dark:text-gray-400">{t('loss.have_scope_desc')}</p>
              </div>
            </button>
          </div>

          <div>
            <button
              onClick={() => setHasExistingScope(false)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                hasExistingScope === false 
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              aria-pressed={hasExistingScope === false}
              aria-describedby="new-scope-desc"
            >
              <RefreshCw className="h-6 w-6 text-blue-600 mb-2" aria-hidden="true" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{t('loss.create_new')}</h4>
                <p id="new-scope-desc" className="text-sm text-gray-600 dark:text-gray-400">{t('loss.create_new_desc')}</p>
              </div>
            </button>
          </div>
        </fieldset>

        {hasExistingScope === true && (
          <div>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 sm:p-8 text-center mb-6">
              <FileUpload
                accept=".pdf"
                multiple={false}
                maxSize={25}
                onFileSelect={(files) => setFile(files[0])}
                selectedFiles={file ? [file] : []}
                onFileRemove={() => setFile(null)}
                title={t('loss.upload_scope')}
                description={t('loss.upload_scope_desc')}
              />
            </div>
          </div>
        )}

        {hasExistingScope === true && file && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">{t('loss.additional_docs')}</h4>
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <legend className="sr-only">Documentos adicionales</legend>
              
              <button
                onClick={() => setAdditionalDocuments(true)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  additionalDocuments === true 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                aria-pressed={additionalDocuments === true}
              >
                <div className="text-left">
                  <h5 className="font-medium text-gray-900 dark:text-white">{t('loss.additional_yes')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('loss.additional_yes_desc')}</p>
                </div>
              </button>

              <button
                onClick={() => setAdditionalDocuments(false)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  additionalDocuments === false 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                aria-pressed={additionalDocuments === false}
              >
                <div className="text-left">
                  <h5 className="font-medium text-gray-900 dark:text-white">{t('loss.additional_no')}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('loss.additional_no_desc')}</p>
                </div>
              </button>
            </fieldset>

            {additionalDocuments === true && (
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
                maxSize={15}
                onFileSelect={(files) => setAdditionalFiles([...additionalFiles, ...files])}
                selectedFiles={additionalFiles}
                onFileRemove={removeAdditionalFile}
                title={t('loss.upload_additional')}
                description={t('loss.upload_additional_desc')}
              />
            )}
          </div>
        )}

        {hasExistingScope === false && (
          <div className="mb-6">
           <h4 className="font-medium text-gray-900 dark:text-white mb-4">{t('loss.format_question')}</h4>
            <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <legend className="sr-only">Formato del estimado</legend>
              
              <button
                onClick={() => setSelectedFormat('xactimate')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedFormat === 'xactimate' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                aria-pressed={selectedFormat === 'xactimate'}
              >
                <Settings className="h-6 w-6 text-blue-600 mb-2" aria-hidden="true" />
                <div className="text-left">
                  <h5 className="font-medium text-gray-900 dark:text-white">Xactimate</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Formato estándar de la industria</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Precio base</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedFormat('symbility')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedFormat === 'symbility' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                aria-pressed={selectedFormat === 'symbility'}
              >
                <FileText className="h-6 w-6 text-green-600 mb-2" aria-hidden="true" />
                <div className="text-left">
                  <h5 className="font-medium text-gray-900 dark:text-white">Symbility</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Formato alternativo de estimación</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">+$20 USD extra</p>
                </div>
              </button>
            </fieldset>

            {selectedFormat === 'symbility' && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h6 className="font-medium text-amber-800 dark:text-amber-200">{t('loss.symbility_cost')}</h6>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      {t('loss.symbility_cost_desc')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-200">{t('loss.info_title')}</h5>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {hasExistingScope === true 
                  ? t('loss.info_existing')
                  : t('loss.info_new')
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <LoadingButton
            onClick={onPrev}
            variant="secondary"
            size="lg"
            className="w-full sm:flex-1"
          >
            {t('button.back')}
          </LoadingButton>
          <LoadingButton
            onClick={handleNext}
            loading={isLoading}
            disabled={!isFormValid()}
            variant="primary"
            size="lg"
            className="w-full sm:flex-1"
          >
            {t('button.continue')}
          </LoadingButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default LossSummary;