import React from 'react';
import { CheckCircle, Download, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedCard from '../ui/AnimatedCard';
import LoadingButton from '../ui/LoadingButton';

interface OrderCompleteProps {
  formData: any;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({ formData }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-2xl mx-auto">
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="mb-6">
          <AnimatedCard delay={100} direction="up">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
          </AnimatedCard>
          <AnimatedCard delay={200} direction="up">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{t('complete.title')}</h3>
          </AnimatedCard>
          <AnimatedCard delay={300} direction="up">
            <p className="text-gray-600 dark:text-gray-400">
            {t('complete.subtitle')}
          </p>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={400} direction="up" className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-2">{t('complete.what_next')}</h4>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>{t('complete.review_time')}</p>
            <p>{t('complete.email_confirmation')}</p>
            <p>{t('complete.delivery_time')} {formData.selectedPackage?.deliveryTime}</p>
            <p>{t('complete.dashboard_access')}</p>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnimatedCard delay={500} direction="left">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h5 className="font-medium text-gray-900 dark:text-white mb-1">{t('complete.estimated_delivery')}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formData.selectedPackage?.deliveryTime}</p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={600} direction="right">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h5 className="font-medium text-gray-900 dark:text-white mb-1">{t('complete.order_confirmation')}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('complete.sent_to')} {formData.email}</p>
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={700} direction="up" className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">{t('complete.order_summary_title')}</h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300">{formData.selectedPackage?.name}</span>
              <span className="font-medium text-gray-900 dark:text-white">${formData.selectedPackage?.totalPrice || formData.selectedPackage?.price}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>{t('complete.property')} {formData.address}</p>
              <p>{t('complete.loss_type')} {formData.typeOfLoss}</p>
              <p>{t('complete.scope_items')} {formData.scopeItems?.length || 0} {t('complete.scope_selected')}</p>
              {formData.selectedFormat === 'symbility' && (
                <p>{t('complete.format')} Symbility (+$20 USD)</p>
              )}
              {formData.measurementType && (
                <p>{t('complete.measurements')} {formData.measurementType === 'full' ? t('cart.measurements_full') : t('cart.measurements_roof')} 
                  (+${formData.measurementType === 'full' ? '50' : '25'} USD)</p>
              )}
            </div>
          </div>
        </AnimatedCard>

        <div className="space-y-3">
          <AnimatedCard delay={800} direction="up">
            <LoadingButton
              variant="primary"
              size="lg"
              className="w-full"
              icon={<Download className="h-5 w-5" />}
            >
              {t('complete.download_receipt')}
            </LoadingButton>
          </AnimatedCard>
          <AnimatedCard delay={900} direction="up">
            <LoadingButton
              variant="secondary"
              size="lg"
              className="w-full"
            >
            {t('complete.track_order')}
            </LoadingButton>
          </AnimatedCard>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default OrderComplete;