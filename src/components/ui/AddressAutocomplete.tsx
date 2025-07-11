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

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
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
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleLoaded(true);
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        // Create a dummy div for PlacesService (required by Google)
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
      } else {
        // Retry after 100ms if Google Maps isn't loaded yet
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  }, []);

  const searchAddresses = async (query: string): Promise<AddressSuggestion[]> => {
    if (!isGoogleLoaded || !autocompleteService.current) {
      console.warn('Google Maps not loaded yet');
      return [];
    }

    return new Promise((resolve) => {
      const request = {
        input: query,
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Restrict to US addresses
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const formattedSuggestions = predictions.slice(0, 5).map((prediction) => ({
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: {
                main_text: prediction.structured_formatting.main_text,
                secondary_text: prediction.structured_formatting.secondary_text || ''
              }
            }));
            resolve(formattedSuggestions);
          } else {
            resolve([]);
          }
        }
      );
    });
  };

  const getPlaceDetails = async (placeId: string): Promise<any> => {
    if (!isGoogleLoaded || !placesService.current) {
      return null;
    }

    return new Promise((resolve) => {
      const request = {
        placeId: placeId,
        fields: ['formatted_address', 'address_components', 'geometry', 'name']
      };

      placesService.current.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          resolve(null);
        }
      });
    });
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3 || !isGoogleLoaded) {
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
  }, [value, isGoogleLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    // Get detailed place information
    const placeDetails = await getPlaceDetails(suggestion.place_id);
    
    onChange(suggestion.description, {
      place_id: suggestion.place_id,
      formatted_address: suggestion.description,
      place_details: placeDetails
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
          disabled={disabled || !isGoogleLoaded}
          required={required}
          className={`
            w-full px-3 py-2 pl-10 pr-10 border rounded-md 
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-300 ease-in-out
            ${disabled || !isGoogleLoaded ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700'}
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

        {!isGoogleLoaded && (
          <div className="absolute right-3 top-2.5">
            <div className="h-4 w-4 bg-yellow-400 rounded-full animate-pulse" title="Cargando Google Maps..." />
          </div>
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
          
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-1">
              <span>Powered by</span>
              <span className="font-semibold">Google</span>
            </div>
          </div>
        </div>
      )}

      {!isGoogleLoaded && (
        <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
          Cargando servicio de direcciones...
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;