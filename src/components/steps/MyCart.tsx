import React, { useState } from 'react';
import { ShoppingCart, FileText, Clock, DollarSign, Code, Mail, PenTool, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingButton from '../ui/LoadingButton';

interface MyCartProps {
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const MyCart: React.FC<MyCartProps> = ({ onNext, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('standard');

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleNext();
    }
  };

  const packages = [
    {
      id: 'basic',
      name: 'Basic Estimate',
      price: 75,
      deliveryTime: '2-3 business days',
      features: [
        'Estimado profesional Xactimate',
        'Documentación básica del scope',
        'Precios estándar del mercado',
        'Códigos incluidos',
        'Entrega por email'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Estimate',
      price: 125,
      deliveryTime: '1-2 business days',
      features: [
        'Estimado profesional detallado',
        'Documentación completa del scope',
        'Precios ajustados al mercado',
        'Códigos incluidos',
        'Carta de apoyo al seguro',
        'Acceso al portal del cliente'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Estimate',
      price: 195,
      deliveryTime: 'Same day',
      features: [
        'Estimado profesional completo',
        'Documentación detallada del scope',
        'Precios ajustados al mercado',
        'Códigos incluidos',
        'Carta de apoyo al seguro',
        'Diagramas y esquemas técnicos',
        'Soporte prioritario',
        'Una revisión incluida'
      ]
    }
  ];

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  
  // Calculate additional costs
  const symbilityExtra = formData.selectedFormat === 'symbility' ? 20 : 0;
  const measurementCost = formData.provideMeasurements === false ? 
    (formData.measurementType === 'full' ? 50 : formData.measurementType === 'roof' ? 25 : 0) : 0;
  
  const basePrice = selectedPkg?.price || 0;
  const totalPrice = basePrice + symbilityExtra + measurementCost;

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'basic':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'standard':
        return <Mail className="h-6 w-6 text-green-600" />;
      case 'premium':
        return <PenTool className="h-6 w-6 text-purple-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleNext = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setFormData({ 
        ...formData, 
        selectedPackage: {
          ...selectedPkg,
          originalPrice: selectedPkg?.price,
          symbilityExtra,
          measurementCost,
          totalPrice
        }
      });
      
      showSuccess('Paquete seleccionado', `${selectedPkg?.name} agregado al carrito`);
      setIsLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('steps.my_cart')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('language.spanish') === 'Español' ? 'Selecciona el paquete de estimado que mejor se adapte a tus necesidades.' : 'Select the estimate package that best fits your needs.'}
        </p>

        <fieldset className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <legend className="sr-only">Paquetes de estimado</legend>
          
          {packages.map((pkg) => (
            <div key={pkg.id}>
              <div
                className={`border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <input
                  type="radio"
                  name="package"
                  value={pkg.id}
                  checked={selectedPackage === pkg.id}
                  onChange={() => setSelectedPackage(pkg.id)}
                  className="sr-only"
                  aria-describedby={`package-${pkg.id}-description`}
                />
                
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    {getPackageIcon(pkg.id)}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{pkg.name}</h4>
                  <div className="flex items-center justify-center space-x-1">
                    <DollarSign className="h-6 w-6 text-green-600" aria-hidden="true" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{pkg.deliveryTime}</span>
                </div>

                <ul id={`package-${pkg.id}-description`} className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedPackage === pkg.id && (
                  <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md text-center">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Seleccionado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </fieldset>

        {/* Package Details */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-6">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
            Lo que incluye tu paquete seleccionado:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Siempre incluido:</h6>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li className="flex items-center space-x-2">
                  <Code className="h-3 w-3 text-green-500" aria-hidden="true" />
                  <span>Códigos de construcción</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FileText className="h-3 w-3 text-green-500" aria-hidden="true" />
                  <span>Estimado profesional Xactimate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <DollarSign className="h-3 w-3 text-green-500" aria-hidden="true" />
                  <span>Precios de mercado actualizados</span>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Adicionales según paquete:</h6>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {selectedPkg?.id !== 'basic' && (
                  <li className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-blue-500" aria-hidden="true" />
                    <span>Carta de apoyo al seguro</span>
                  </li>
                )}
                {selectedPkg?.id === 'premium' && (
                  <>
                    <li className="flex items-center space-x-2">
                      <PenTool className="h-3 w-3 text-purple-500" aria-hidden="true" />
                      <span>Diagramas y esquemas técnicos</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RefreshCw className="h-3 w-3 text-purple-500" aria-hidden="true" />
                      <span>Una revisión incluida</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">{selectedPkg?.name}</span>
              <span className="font-medium text-gray-900 dark:text-white">${selectedPkg?.price}</span>
            </div>
            
            {symbilityExtra > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Formato Symbility (extra)</span>
                <span className="text-amber-600 dark:text-amber-400">+${symbilityExtra}</span>
              </div>
            )}
            
            {measurementCost > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Medidas {formData.measurementType === 'full' ? 'Completas' : 'Solo Techo'}
                </span>
                <span className="text-blue-600 dark:text-blue-400">+${measurementCost}</span>
              </div>
            )}
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${totalPrice}</span>
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
              Atrás
            </LoadingButton>
            <LoadingButton
              onClick={handleNext}
              loading={isLoading}
              variant="success"
              size="lg"
              className="w-full sm:flex-1"
              icon={<ShoppingCart className="h-5 w-5" />}
            >
              Proceder al Checkout
            </LoadingButton>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default MyCart;