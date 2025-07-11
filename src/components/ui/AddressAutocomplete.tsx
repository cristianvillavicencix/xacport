import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, details?: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Ingresa una dirección",
  className = "",
  disabled = false,
  required = false
}) => {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock Google Places API - In production, replace with actual Google Places API
  const mockAddresses = [
    "123 Main Street, Miami, FL 33101, USA",
    "456 Ocean Drive, Miami Beach, FL 33139, USA",
    "789 Biscayne Boulevard, Miami, FL 33132, USA",
    "321 Lincoln Road, Miami Beach, FL 33139, USA",
    "654 Collins Avenue, Miami Beach, FL 33140, USA",
    "987 Washington Avenue, Miami Beach, FL 33139, USA",
    "147 Flagler Street, Miami, FL 33130, USA",
    "258 Coral Way, Miami, FL 33145, USA",
    "369 Calle Ocho, Miami, FL 33135, USA",
    "741 Miracle Mile, Coral Gables, FL 33134, USA"
  ];

  const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = mockAddresses
      .filter(address => 
        address.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map((address, index) => ({
        place_id: `place_${index}`,
        description: address,
        structured_formatting: {
          main_text: address.split(',')[0],
          secondary_text: address.split(',').slice(1).join(',').trim()
        }
      }));

    return filtered;
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchAddresses(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.description, {
      place_id: suggestion.place_id,
      formatted_address: suggestion.description
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3 py-2 pl-10 pr-10 border rounded-md 
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-300 ease-in-out
            ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700'}
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            border-gray-300 dark:border-gray-500 focus:ring-blue-500
            transform hover:scale-[1.02] focus:scale-[1.02]
          `}
          autoComplete="address-line1"
        />
        
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-blue-500 animate-spin" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 
                focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none
                transition-colors duration-200
                ${index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}
                ${index === 0 ? 'rounded-t-md' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-md' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;