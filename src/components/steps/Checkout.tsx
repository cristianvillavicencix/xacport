import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import FormField from '../ui/FormField';
import LoadingButton from '../ui/LoadingButton';

interface CheckoutProps {
  onComplete: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onComplete, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && paymentData.cardNumber && paymentData.cardName && !isProcessing) {
      handleSubmit();
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setPaymentData({ ...paymentData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    if (!paymentData.cardNumber || !paymentData.cardName) {
      showError('Información incompleta', 'Por favor completa la información de pago');
      setIsProcessing(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setFormData({ ...formData, paymentData });
      showSuccess('Pago procesado', 'Tu pedido ha sido completado exitosamente');
      setIsProcessing(false);
      onComplete();
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('checkout.title')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('checkout.subtitle')}
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('checkout.order_summary')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">{formData.selectedPackage?.name}</span>
              <span className="font-medium text-gray-900 dark:text-white">${formData.selectedPackage?.originalPrice || formData.selectedPackage?.price}</span>
            </div>
            
            {formData.selectedPackage?.symbilityExtra > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Formato Symbility (extra)</span>
                <span className="text-amber-600 dark:text-amber-400">+${formData.selectedPackage.symbilityExtra}</span>
              </div>
            )}
            
            {formData.selectedPackage?.measurementCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Medidas {formData.measurementType === 'full' ? 'Completas' : 'Solo Techo'}
                </span>
                <span className="text-blue-600 dark:text-blue-400">+${formData.selectedPackage.measurementCost}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{t('checkout.delivery')}</span>
              <span>{formData.selectedPackage?.deliveryTime}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-500 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>${formData.selectedPackage?.totalPrice || formData.selectedPackage?.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <fieldset>
            <legend className="sr-only">Información de pago</legend>
            
            <FormField
              label={t('checkout.card_number')}
              placeholder={t('checkout.card_number_placeholder')}
              value={paymentData.cardNumber}
              onChange={(value) => handleInputChange('cardNumber', value)}
              validation={{ required: true, minLength: 16 }}
              icon={<CreditCard className="h-4 w-4" />}
              autoComplete="cc-number"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label={t('checkout.expiry_date')}
                placeholder={t('checkout.expiry_placeholder')}
                value={paymentData.expiryDate}
                onChange={(value) => handleInputChange('expiryDate', value)}
                validation={{ required: true, minLength: 5 }}
                autoComplete="cc-exp"
              />
              <FormField
                label={t('checkout.cvv')}
                placeholder={t('checkout.cvv_placeholder')}
                value={paymentData.cvv}
                onChange={(value) => handleInputChange('cvv', value)}
                validation={{ required: true, minLength: 3, maxLength: 4 }}
                autoComplete="cc-csc"
              />
            </div>

            <FormField
              label={t('checkout.cardholder_name')}
              placeholder={t('checkout.cardholder_placeholder')}
              value={paymentData.cardName}
              onChange={(value) => handleInputChange('cardName', value)}
              validation={{ required: true, minLength: 2 }}
              autoComplete="cc-name"
            />
          </fieldset>

          <fieldset>
            <legend className="sr-only">Dirección de facturación</legend>
            
            <FormField
              label={t('checkout.billing_address')}
              placeholder={t('checkout.billing_placeholder')}
              value={paymentData.billingAddress}
              onChange={(value) => handleInputChange('billingAddress', value)}
              validation={{ required: true, minLength: 10 }}
              autoComplete="billing street-address"
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                label={t('checkout.city')}
                placeholder={t('checkout.city_placeholder')}
                value={paymentData.city}
                onChange={(value) => handleInputChange('city', value)}
                validation={{ required: true, minLength: 2 }}
                autoComplete="billing address-level2"
              />
              <FormField
                label={t('checkout.state')}
                placeholder={t('checkout.state_placeholder')}
                value={paymentData.state}
                onChange={(value) => handleInputChange('state', value)}
                validation={{ required: true, minLength: 2 }}
                autoComplete="billing address-level1"
              />
              <FormField
                label={t('checkout.zip_code')}
                placeholder={t('checkout.zip_placeholder')}
                value={paymentData.zipCode}
                onChange={(value) => handleInputChange('zipCode', value)}
                validation={{ required: true, minLength: 5 }}
                autoComplete="billing postal-code"
              />
            </div>
          </fieldset>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {t('checkout.security_note')}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <LoadingButton
            onClick={onPrev}
            disabled={isProcessing}
            variant="secondary"
            size="lg"
            className="w-full sm:flex-1"
          >
            {t('button.back')}
          </LoadingButton>
          <LoadingButton
            onClick={handleSubmit}
            loading={isProcessing}
            disabled={isProcessing || !paymentData.cardNumber || !paymentData.cardName}
            variant="success"
            size="lg"
            className="w-full sm:flex-1"
            icon={<Lock className="h-5 w-5" />}
          >
            {isProcessing 
              ? t('checkout.processing')
              : `${t('checkout.complete_payment')} - $${formData.selectedPackage?.totalPrice || formData.selectedPackage?.price}`
            }
          </LoadingButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Checkout;