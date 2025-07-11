import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { useFormPersistence } from './hooks/useFormPersistence';
import { useAutoScroll } from './hooks/useAutoScroll';
import { clearFormData } from './utils/storage';
import ConfirmDialog from './components/ui/ConfirmDialog';
import StepTransition from './components/ui/StepTransition';
import ProgressIndicator from './components/ui/ProgressIndicator';
import Header from './components/Header';
import ClientRegistration from './components/steps/ClientRegistration';
import LossSummary from './components/steps/LossSummary';
import JobClaimInformation from './components/steps/JobClaimInformation';
import MeasurementsPhotos from './components/steps/MeasurementsPhotos';
import ScopeDetails from './components/steps/ScopeDetails';
import MyCart from './components/steps/MyCart';
import Checkout from './components/steps/Checkout';
import OrderComplete from './components/steps/OrderComplete';
import Footer from './components/Footer';
import OfflineIndicator from './components/OfflineIndicator';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function AppContent() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');

  // Define step keys instead of translated values
  const stepKeys = [
    'steps.client_registration',
    'steps.loss_summary',
    'steps.property_claim_info',
    'steps.measurements_photos',
    'steps.scope_details',
    'steps.my_cart',
    'steps.checkout'
  ];

  // Enable form persistence
  useFormPersistence(formData, setFormData);
  
  // Enable auto scroll when step changes
  useAutoScroll(currentStep);

  // Dynamic steps based on whether user has existing scope
  const getActiveSteps = () => {
    const shouldSkipJobInfo = formData.hasExistingScope === true;
    if (shouldSkipJobInfo) {
      return stepKeys.filter((_, index) => index !== 2); // Remove step 3 (index 2)
    }
    return stepKeys;
  };

  const activeStepKeys = getActiveSteps();
  const activeSteps = activeStepKeys.map(key => t(key));

  const nextStep = () => {
    if (currentStep < activeSteps.length - 1) {
      setStepDirection('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setStepDirection('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  const cancelProcess = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setCurrentStep(0);
    setFormData({});
    clearFormData();
    setShowCancelDialog(false);
  };

  const handleCancelCancel = () => {
    setShowCancelDialog(false);
  };
  const handleComplete = () => {
    clearFormData(); // Clear saved data on completion
    setIsComplete(true);
  };

  const renderStep = () => {
    const stepProps = {
      onNext: nextStep,
      onPrev: prevStep,
      onCancel: cancelProcess,
      currentStep,
      formData,
      setFormData
    };

    // Skip job/claim information if user has existing scope
    const shouldSkipJobInfo = formData.hasExistingScope === true;
    
    if (shouldSkipJobInfo) {
      // Steps when skipping job/claim info: 0,1,2,3,4,5 (6 total steps)
      switch (currentStep) {
        case 0:
          return <ClientRegistration {...stepProps} />;
        case 1:
          return <LossSummary {...stepProps} />;
        case 2:
          return <MeasurementsPhotos {...stepProps} />;
        case 3:
          return <ScopeDetails {...stepProps} />;
        case 4:
          return <MyCart {...stepProps} />;
        case 5:
          return <Checkout {...stepProps} onComplete={handleComplete} />;
        default:
          return <ClientRegistration {...stepProps} />;
      }
    } else {
      // Normal flow with all steps: 0,1,2,3,4,5,6 (7 total steps)
      switch (currentStep) {
        case 0:
          return <ClientRegistration {...stepProps} />;
        case 1:
          return <LossSummary {...stepProps} />;
        case 2:
          return <JobClaimInformation {...stepProps} />;
        case 3:
          return <MeasurementsPhotos {...stepProps} />;
        case 4:
          return <ScopeDetails {...stepProps} />;
        case 5:
          return <MyCart {...stepProps} />;
        case 6:
          return <Checkout {...stepProps} onComplete={handleComplete} />;
        default:
          return <ClientRegistration {...stepProps} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500 flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
        {!isComplete ? (
          <>
            <ProgressIndicator currentStep={currentStep} steps={activeSteps} />
            <StepTransition currentStep={currentStep} direction={stepDirection}>
              {renderStep()}
            </StepTransition>
          </>
        ) : (
          <OrderComplete formData={formData} />
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
      
      <ConfirmDialog
        isOpen={showCancelDialog}
        title={t('button.cancel') + ' Proceso'}
        message={t('validation.cancel_message')}
        confirmText={`${t('button.yes')}, ${t('button.cancel').toLowerCase()}`}
        cancelText={`${t('button.no')}, ${t('button.continue').toLowerCase()}`}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
        type="danger"
      />
      
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;