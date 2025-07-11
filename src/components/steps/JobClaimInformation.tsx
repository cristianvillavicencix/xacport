import React, { useState } from 'react';
import { ChevronDown, Calendar, Search, MapPin, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from '../ui/AnimatedCard';
import FormField from '../ui/FormField';
import AddressAutocomplete from '../ui/AddressAutocomplete';
import LoadingButton from '../ui/LoadingButton';

interface JobClaimInformationProps {
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

const JobClaimInformation: React.FC<JobClaimInformationProps> = ({ onNext, onPrev, onCancel, formData, setFormData }) => {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [jobClaimData, setJobClaimData] = useState({
    propertyAddress: formData.propertyAddress || '',
    homeownerName: formData.homeownerName || '',
    typeOfLoss: formData.typeOfLoss || '',
    dateOfLoss: formData.dateOfLoss || '',
    claimNumber: formData.claimNumber || '',
    insuranceCompany: formData.insuranceCompany || '',
  });

  const [filteredInsuranceCompanies, setFilteredInsuranceCompanies] = useState<string[]>([]);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);

  const insuranceCompanies = [
    'State Farm',
    'GEICO',
    'Progressive',
    'Allstate',
    'USAA',
    'Liberty Mutual',
    'Farmers Insurance',
    'Nationwide',
    'American Family Insurance',
    'Travelers',
    'Auto-Owners Insurance',
    'Country Financial',
    'Amica Mutual',
    'The Hartford',
    'Safeco',
    'MetLife',
    'Esurance',
    'Mercury Insurance',
    '21st Century',
    'The General',
    'Root Insurance',
    'Lemonade',
    'Chubb',
    'AIG',
    'Zurich',
    'CNA',
    'Berkshire Hathaway',
    'Mutual of Omaha',
    'AAA',
    'CSAA',
    'Erie Insurance',
    'Grange Insurance',
    'Horace Mann',
    'IMT Insurance',
    'Kemper',
    'National General',
    'Pekin Insurance',
    'Plymouth Rock',
    'Pure Insurance',
    'Shelter Insurance',
    'Texas Farm Bureau',
    'TWFG Insurance',
    'United Services Automobile Association',
    'Westfield Insurance'
  ];

  const lossTypes = [
    { key: 'fire', label: t('loss_type.fire') },
    { key: 'water', label: t('loss_type.water') },
    { key: 'storm', label: t('loss_type.storm') },
    { key: 'theft', label: t('loss_type.theft') },
    { key: 'vandalism', label: t('loss_type.vandalism') },
    { key: 'earthquake', label: t('loss_type.earthquake') },
    { key: 'flood', label: t('loss_type.flood') },
    { key: 'wind', label: t('loss_type.wind') },
    { key: 'hail', label: t('loss_type.hail') },
    { key: 'other', label: t('loss_type.other') }
  ];

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isFormValid()) {
      handleNext();
    }
  };

  const isFormValid = () => {
    return jobClaimData.propertyAddress && 
           jobClaimData.homeownerName && 
           jobClaimData.typeOfLoss;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'insuranceCompany') {
      const filtered = insuranceCompanies.filter(company =>
        company.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInsuranceCompanies(filtered);
      setShowInsuranceDropdown(value.length > 0 && filtered.length > 0);
    }
    setJobClaimData({ ...jobClaimData, [field]: value });
  };

  const selectInsuranceCompany = (company: string) => {
    setJobClaimData({ ...jobClaimData, insuranceCompany: company });
    setShowInsuranceDropdown(false);
  };

  const handleNext = () => {
    if (!isFormValid()) {
      showError('Información incompleta', 'Por favor completa los campos requeridos');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setFormData({ ...formData, ...jobClaimData });
      showSuccess('Información guardada', 'Los datos de la propiedad han sido registrados');
      setIsLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto" onKeyPress={handleKeyPress}>
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('job.title')}</h3>
        <p className="text-gray-600 mb-6">
          {t('job.subtitle')}
        </p>

        <div className="space-y-6">
          {/* Job Information Section */}
          <AnimatedCard delay={100} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              {t('job.property_info')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('job.property_address')} *
                </label>
                <AddressAutocomplete
                  value={jobClaimData.propertyAddress}
                  onChange={(value, details) => {
                    handleInputChange('propertyAddress', value);
                    if (details) {
                      console.log('Address details:', details);
                    }
                  }}
                  placeholder={t('job.property_address_placeholder')}
                  required={true}
                />
              </div>
              
              {/* <FormField
                label={t('job.property_address')}
                placeholder={t('job.property_address_placeholder')}
                value={jobClaimData.propertyAddress}
                onChange={(value) => handleInputChange('propertyAddress', value)}
                validation={{ required: true, minLength: 10 }}
                icon={<MapPin className="h-4 w-4" />}
                autoComplete="address-line1"
              /> */}

              <FormField
                label={t('job.homeowner_name')}
                placeholder={t('job.homeowner_name_placeholder')}
                value={jobClaimData.homeownerName}
                onChange={(value) => handleInputChange('homeownerName', value)}
                validation={{ required: true, minLength: 2 }}
                icon={<User className="h-4 w-4" />}
                autoComplete="name"
              />
            </div>
          </AnimatedCard>

          {/* Claim Information Section */}
          <AnimatedCard delay={200} direction="up">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              {t('job.claim_info')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('job.loss_type')} *
                </label>
                <div className="relative">
                  <select
                    value={jobClaimData.typeOfLoss}
                    onChange={(e) => handleInputChange('typeOfLoss', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">{t('job.loss_type_placeholder')}</option>
                    {lossTypes.map((type) => (
                      <option key={type.key} value={type.key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('job.loss_date')}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={jobClaimData.dateOfLoss}
                    onChange={(e) => handleInputChange('dateOfLoss', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('job.claim_number')}
                </label>
                <input
                  type="text"
                  placeholder={t('job.claim_number_placeholder')}
                  value={jobClaimData.claimNumber}
                  onChange={(e) => handleInputChange('claimNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('job.insurance_company')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('job.insurance_company_placeholder')}
                    value={jobClaimData.insuranceCompany}
                    onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                    onFocus={() => {
                      if (jobClaimData.insuranceCompany && filteredInsuranceCompanies.length > 0) {
                        setShowInsuranceDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow for selection
                      setTimeout(() => setShowInsuranceDropdown(false), 200);
                    }}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                {showInsuranceDropdown && filteredInsuranceCompanies.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredInsuranceCompanies.slice(0, 10).map((company, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectInsuranceCompany(company)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {company}
                      </button>
                    ))}
                    {filteredInsuranceCompanies.length > 10 && (
                      <div className="px-3 py-2 text-sm text-gray-500 border-t">
                        {t('job.search_results')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={300} direction="up" className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6 mb-6">
          <div className="flex items-start space-x-3">
            <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-200">{t('job.estimate_info')}</h5>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {t('job.estimate_info_desc')}
              </p>
            </div>
          </div>
        </AnimatedCard>

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

export default JobClaimInformation;