import React, { useState } from 'react';
import { User, Building, Mail, Phone, MapPin, Upload, Copy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import FormField from '../ui/FormField';
import LoadingButton from '../ui/LoadingButton';

interface ClientRegistrationProps {
  onNext: () => void;
  onPrev?: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const ClientRegistration: React.FC<ClientRegistrationProps> = ({ onNext, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [isExistingClient, setIsExistingClient] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState({
    existingClientEmail: formData.existingClientEmail || '',
    fullName: formData.fullName || '',
    companyName: formData.companyName || '',
    companyLogo: formData.companyLogo || null,
    contactAddress: formData.contactAddress || '',
    email: formData.email || '',
    phone: formData.phone || '',
    companyAddress: formData.companyAddress || '',
    sameAddress: formData.sameAddress || false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
  };

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleNext();
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Format phone number
    if (field === 'phone' && typeof value === 'string') {
      value = formatPhoneNumber(value);
    }

    setClientData({ ...clientData, [field]: value });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (isExistingClient === true) {
      if (!clientData.existingClientEmail) {
        newErrors.existingClientEmail = 'El correo electrónico es requerido';
      } else if (!isValidEmail(clientData.existingClientEmail)) {
        newErrors.existingClientEmail = 'Por favor ingresa un correo electrónico válido';
      }
    } else if (isExistingClient === false) {
      if (!clientData.fullName.trim()) {
        newErrors.fullName = 'El nombre completo es requerido';
      }
      if (!clientData.companyName.trim()) {
        newErrors.companyName = 'El nombre de la empresa es requerido';
      }
      if (!clientData.contactAddress.trim()) {
        newErrors.contactAddress = 'La dirección de contacto es requerida';
      }
      if (!clientData.email) {
        newErrors.email = 'El correo electrónico es requerido';
      } else if (!isValidEmail(clientData.email)) {
        newErrors.email = 'Por favor ingresa un correo electrónico válido';
      }
      if (!clientData.phone) {
        newErrors.phone = 'El número de teléfono es requerido';
      } else if (!isValidPhone(clientData.phone)) {
        newErrors.phone = 'Por favor ingresa un número de teléfono válido';
      }
      if (!clientData.sameAddress && !clientData.companyAddress.trim()) {
        newErrors.companyAddress = 'La dirección de la empresa es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setClientData({ ...clientData, companyLogo: selectedFile });
    }
  };

  const handleSameAddressToggle = () => {
    const newSameAddress = !clientData.sameAddress;
    setClientData({ 
      ...clientData, 
      sameAddress: newSameAddress,
      companyAddress: newSameAddress ? clientData.contactAddress : clientData.companyAddress
    });
  };

  const handleNext = () => {
    if (!validateForm()) {
      showError('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormData({ 
        ...formData, 
        isExistingClient,
        ...clientData 
      });
      
      showSuccess(
        isExistingClient ? 'Cliente verificado' : 'Registro exitoso',
        isExistingClient ? 'Información cargada correctamente' : 'Tu información ha sido guardada'
      );
      
      setIsLoading(false);
      onNext();
    }, 1500);
  };

  const isFormValid = () => {
    if (isExistingClient === true) return clientData.existingClientEmail.trim() !== '';
    
    return clientData.fullName && 
           clientData.companyName && 
           clientData.contactAddress && 
           clientData.email && 
           clientData.phone &&
           (clientData.sameAddress || clientData.companyAddress);
  };

  return (
    <div className="max-w-2xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('client.title')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('client.subtitle')}
        </p>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <legend className="sr-only">Tipo de cliente</legend>
          
          <div>
            <button
              onClick={() => setIsExistingClient(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isExistingClient === true 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              aria-pressed={isExistingClient === true}
              aria-describedby="existing-client-desc"
            >
              <User className="h-6 w-6 text-green-600 mb-2" aria-hidden="true" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{t('client.existing')}</h4>
                <p id="existing-client-desc" className="text-sm text-gray-600 dark:text-gray-400">{t('client.existing_desc')}</p>
              </div>
            </button>
          </div>

          <div>
            <button
              onClick={() => setIsExistingClient(false)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isExistingClient === false 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              aria-pressed={isExistingClient === false}
              aria-describedby="new-client-desc"
            >
              <Building className="h-6 w-6 text-blue-600 mb-2" aria-hidden="true" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{t('client.new')}</h4>
                <p id="new-client-desc" className="text-sm text-gray-600 dark:text-gray-400">{t('client.new_desc')}</p>
              </div>
            </button>
          </div>
        </fieldset>

        {isExistingClient === false && (
          <div className="space-y-6">
            {/* Información de Contacto */}
            <fieldset>
              <legend className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
                {t('client.contact_info')}
              </legend>
              <div className="space-y-4">
                <FormField
                  label={t('client.full_name')}
                  placeholder={t('client.full_name_placeholder')}
                  value={clientData.fullName}
                  onChange={(value) => handleInputChange('fullName', value)}
                  validation={{ required: true, minLength: 2 }}
                  icon={<User className="h-4 w-4" />}
                  autoComplete="name"
                />

                <FormField
                  label={t('client.contact_address')}
                  placeholder={t('client.contact_address_placeholder')}
                  value={clientData.contactAddress}
                  onChange={(value) => handleInputChange('contactAddress', value)}
                  validation={{ required: true, minLength: 10 }}
                  icon={<MapPin className="h-4 w-4" />}
                  autoComplete="address-line1"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t('client.email')}
                    type="email"
                    placeholder={t('client.email_placeholder')}
                    value={clientData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    validation={{ 
                      required: true, 
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
                    }}
                    icon={<Mail className="h-4 w-4" />}
                    autoComplete="email"
                  />

                  <FormField
                    label={t('client.phone')}
                    type="tel"
                    placeholder={t('client.phone_placeholder')}
                    value={clientData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    validation={{ 
                      required: true,
                      custom: (value) => {
                        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                        return cleanPhone.length >= 10 ? null : 'Número de teléfono inválido';
                      }
                    }}
                    icon={<Phone className="h-4 w-4" />}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </fieldset>

            {/* Información de la Empresa */}
            <fieldset>
              <legend className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
                {t('client.company_info')}
              </legend>
              <div className="space-y-4">
                <FormField
                  label={t('client.company_name')}
                  placeholder={t('client.company_name_placeholder')}
                  value={clientData.companyName}
                  onChange={(value) => handleInputChange('companyName', value)}
                  validation={{ required: true, minLength: 2 }}
                  icon={<Building className="h-4 w-4" />}
                  autoComplete="organization"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('client.company_logo')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.company_logo_desc')}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                    >
                      {t('button.select_file')}
                    </label>
                    {clientData.companyLogo && (
                      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                        {t('client.logo_selected')} {(clientData.companyLogo as File).name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('client.company_address')} *
                  </label>
                  
                  <div className="mb-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clientData.sameAddress}
                        onChange={handleSameAddressToggle}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
                        {t('client.same_address')}
                      </span>
                    </label>
                  </div>

                  {!clientData.sameAddress && (
                    <FormField
                      label=""
                      placeholder={t('client.company_address_placeholder')}
                      value={clientData.companyAddress}
                      onChange={(value) => handleInputChange('companyAddress', value)}
                      validation={{ required: !clientData.sameAddress, minLength: 10 }}
                      icon={<MapPin className="h-4 w-4" />}
                      autoComplete="address-line1"
                    />
                  )}

                  {clientData.sameAddress && (
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('client.address_info')} {clientData.contactAddress || t('client.address_enter_first')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {isExistingClient === true && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h5 className="font-medium text-green-800 dark:text-green-200">{t('client.existing_info')}</h5>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {t('client.existing_help')}
                  </p>
                </div>
              </div>
            </div>
            
            <FormField
              label={t('client.email')}
              type="email"
              placeholder={t('client.email_placeholder')}
              value={clientData.existingClientEmail}
              onChange={(value) => handleInputChange('existingClientEmail', value)}
              validation={{ 
                required: true, 
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
              }}
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <LoadingButton
            onClick={handleNext}
            loading={isLoading}
            disabled={!isFormValid()}
            variant="primary"
            size="lg"
            className="w-full sm:flex-1"
          >
            {isExistingClient === true ? t('button.continue') : t('button.register_continue')}
          </LoadingButton>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default ClientRegistration;