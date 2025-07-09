import React, { useState } from 'react';
import { Plus, Minus, FileText, Zap, Shield, Home, Hammer, Wrench } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingButton from '../ui/LoadingButton';

interface ScopeDetailsProps {
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const ScopeDetails: React.FC<ScopeDetailsProps> = ({ onNext, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [estimateStyle, setEstimateStyle] = useState<string>('standard');
  const [estimateType, setEstimateType] = useState<string>('');
  const [scopeItems, setScopeItems] = useState([
    { id: 1, name: 'Roof Inspection & Assessment', selected: true },
    { id: 2, name: 'Exterior Damage Documentation', selected: true },
    { id: 3, name: 'Interior Damage Assessment', selected: false },
    { id: 4, name: 'Structural Analysis', selected: false },
    { id: 5, name: 'HVAC System Inspection', selected: false },
    { id: 6, name: 'Electrical System Review', selected: false },
    { id: 7, name: 'Plumbing Assessment', selected: false },
    { id: 8, name: 'Flooring Damage Evaluation', selected: false },
  ]);

  const [additionalNotes, setAdditionalNotes] = useState('');

  const estimateTypes = [
    { id: 'roof', name: 'Roof Only', icon: Home, description: 'Estimado enfocado únicamente en el techo' },
    { id: 'siding', name: 'Siding', icon: Shield, description: 'Estimado para revestimiento exterior' },
    { id: 'asbestos', name: 'Asbestos', icon: Wrench, description: 'Estimado especializado en asbesto' },
    { id: 'interior', name: 'Interior', icon: Hammer, description: 'Estimado para daños interiores' },
    { id: 'combined', name: 'Combined', icon: Plus, description: 'Estimado combinado (múltiples áreas)' }
  ];

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleNext();
    }
  };

  const isFormValid = () => {
    return estimateType !== '' && scopeItems.some(item => item.selected);
  };

  const toggleScopeItem = (id: number) => {
    setScopeItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleNext = () => {
    if (!isFormValid()) {
      showError('Configuración incompleta', 'Por favor selecciona el tipo de estimado y al menos un elemento del scope');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setFormData({ 
        ...formData, 
        estimateStyle,
        estimateType,
        scopeItems: scopeItems.filter(item => item.selected),
        additionalNotes
      });
      
      showSuccess('Scope configurado', 'Los detalles del estimado han sido guardados');
      setIsLoading(false);
      onNext();
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('steps.scope_details')}</h3>
        <p className="text-gray-600 mb-6">
          {t('language.spanish') === 'Español' ? 'Configura los detalles específicos de tu estimado según tus necesidades.' : 'Configure the specific details of your estimate according to your needs.'}
        </p>

        <div className="space-y-8">
          {/* Estimate Style Section */}
          <AnimatedCard delay={100} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Estilo de Estimado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedCard delay={150} direction="left" hover={true}>
                <button
                  onClick={() => setEstimateStyle('standard')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 w-full ${
                    estimateStyle === 'standard' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Shield className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Estándar</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimado conservador y realista</p>
                    <p className="text-xs text-blue-600 mt-1">Recomendado para la mayoría de casos</p>
                  </div>
                </button>
              </AnimatedCard>

              <AnimatedCard delay={200} direction="right" hover={true}>
                <button
                  onClick={() => setEstimateStyle('aggressive')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 w-full ${
                    estimateStyle === 'aggressive' 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Zap className="h-6 w-6 text-amber-600 mb-2" />
                  <div className="text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Agresivo</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimado más completo y detallado</p>
                    <p className="text-xs text-amber-600 mt-1">Incluye todos los componentes posibles</p>
                  </div>
                </button>
              </AnimatedCard>
            </div>

            <AnimatedCard delay={250} direction="up" className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h6 className="font-medium text-gray-800 dark:text-gray-200">Diferencias entre estilos:</h6>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <strong>Estándar:</strong> Incluye los elementos esenciales y necesarios para la reparación.
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Agresivo:</strong> Incluye elementos adicionales, mejoras y componentes que podrían estar relacionados con el daño.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </AnimatedCard>

          {/* Estimate Type Section */}
          <AnimatedCard delay={300} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-green-600" />
              Tipo de Estimado *
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estimateTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <AnimatedCard key={type.id} delay={350 + (estimateTypes.indexOf(type) * 50)} direction="up" hover={true}>
                    <button
                      onClick={() => setEstimateType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 w-full ${
                        estimateType === type.id 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <IconComponent className="h-6 w-6 text-green-600 mb-2" />
                      <div className="text-left">
                        <h5 className="font-medium text-gray-900 dark:text-white">{type.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                      </div>
                    </button>
                  </AnimatedCard>
                );
              })}
            </div>
          </AnimatedCard>

          {/* Scope Items Section */}
          <AnimatedCard delay={500} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Elementos del Scope
            </h4>
            <div className="space-y-2">
              {scopeItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleScopeItem(item.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-all duration-200 ${
                      item.selected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {item.selected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm ${item.selected ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Additional Notes Section */}
          <AnimatedCard delay={600} direction="up">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales o Instrucciones Especiales
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              placeholder="Proporciona cualquier detalle adicional, áreas específicas de preocupación, o instrucciones especiales para el estimado..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </AnimatedCard>
        </div>

        <AnimatedCard delay={700} direction="up" className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6 mb-6">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-200">Detalles del Estimado</h5>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Tu estimado incluirá líneas detalladas, medidas, precios y códigos para todos los elementos 
                seleccionados del scope. {estimateStyle === 'aggressive' ? 'El estilo agresivo incluirá componentes adicionales y mejoras relacionadas.' : 'El estilo estándar se enfocará en los elementos esenciales.'}
              </p>
            </div>
          </div>
        </AnimatedCard>

        <div className="flex space-x-4">
          <LoadingButton
            onClick={onPrev}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Atrás
          </LoadingButton>
          <LoadingButton
            onClick={handleNext}
            loading={isLoading}
            disabled={!isFormValid()}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Continuar al Carrito
          </LoadingButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ScopeDetails;