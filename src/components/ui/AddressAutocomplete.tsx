import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';

interface AddressDetails {
  formatted_address: string;
  address_components: any[];
  geometry: any;
  place_id: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, details?: AddressDetails) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

// Fallback suggestions for when Google Places is not available
const FALLBACK_SUGGESTIONS = [
  'Miami, FL, USA',
  'Orlando, FL, USA',
  'Tampa, FL, USA',
  'Jacksonville, FL, USA',
  'Fort Lauderdale, FL, USA',
  'New York, NY, USA',
  'Los Angeles, CA, USA',
  'Chicago, IL, USA',
  'Houston, TX, USA',
  'Phoenix, AZ, USA',
  'Philadelphia, PA, USA',
  'San Antonio, TX, USA',
  'San Diego, CA, USA',
  'Dallas, TX, USA',
  'San Jose, CA, USA',
  'Austin, TX, USA',
  'Indianapolis, IN, USA',
  'San Francisco, CA, USA',
  'Columbus, OH, USA',
  'Charlotte, NC, USA',
  'Fort Worth, TX, USA',
  'Detroit, MI, USA',
  'El Paso, TX, USA',
  'Memphis, TN, USA',
  'Seattle, WA, USA',
  'Denver, CO, USA',
  'Washington, DC, USA',
  'Boston, MA, USA',
  'Nashville, TN, USA'
];

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Ingrese dirección...",
  className = "",
  required = false
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [useGooglePlaces, setUseGooglePlaces] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Check if Google Places API is loaded
  useEffect(() => {
    const checkGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setGoogleLoaded(true);
        setUseGooglePlaces(true);
        
        // Initialize services
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        
        // Create a dummy div for PlacesService (required by Google)
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        
        console.log('✅ Google Places API loaded successfully');
      } else {
        console.log('⚠️ Google Places API not available, using fallback');
        setUseGooglePlaces(false);
      }
    };

    // Check immediately
    checkGooglePlaces();

    // Also check after a delay in case the script is still loading
    const timer = setTimeout(checkGooglePlaces, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Debounced search
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (useGooglePlaces && autocompleteService.current) {
        // Use Google Places API
        const request = {
          input: value,
          types: ['address'],
          componentRestrictions: { country: 'us' }
        };

        autocompleteService.current.getPlacePredictions(
          request,
          (predictions, status) => {
            setIsLoading(false);
            
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(predictions.slice(0, 5));
              setIsOpen(true);
              setSelectedIndex(-1);
            } else {
              setSuggestions([]);
              setIsOpen(false);
              console.log('Google Places API error:', status);
            }
          }
        );
      } else {
        // Use fallback suggestions
        const filtered = FALLBACK_SUGGESTIONS.filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        
        setSuggestions(filtered.map(addr => ({ description: addr, place_id: null })));
        setIsOpen(filtered.length > 0);
        setSelectedIndex(-1);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, useGooglePlaces]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getPlaceDetails = (placeId: string, description: string) => {
    if (!useGooglePlaces || !placesService.current || !placeId) {
      // Fallback: just use the description
      onChange(description);
      return;
    }

    const request = {
      placeId: placeId,
      fields: ['formatted_address', 'address_components', 'geometry', 'place_id']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        onChange(place.formatted_address || description, {
          formatted_address: place.formatted_address || description,
          address_components: place.address_components || [],
          geometry: place.geometry,
          place_id: place.place_id || placeId
        });
      } else {
        // Fallback to description
        onChange(description);
      }
    });
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (useGooglePlaces && suggestion.place_id) {
      getPlaceDetails(suggestion.place_id, suggestion.description);
    } else {
      onChange(suggestion.description);
    }
    
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click events on suggestions
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          autoComplete="off"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place_id || suggestion.description}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center space-x-3 ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {useGooglePlaces && suggestion.structured_formatting ? (
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {suggestion.structured_formatting.main_text}
                    </span>
                    {suggestion.structured_formatting.secondary_text && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {suggestion.structured_formatting.secondary_text}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-900 dark:text-white">
                    {suggestion.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Status indicator */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
        {useGooglePlaces ? (
          <>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Powered by Google Places</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Usando sugerencias locales</span>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;