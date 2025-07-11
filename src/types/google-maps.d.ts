// Google Maps TypeScript definitions
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => google.maps.places.AutocompleteService;
          PlacesService: new (element: HTMLElement) => google.maps.places.PlacesService;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            NOT_FOUND: string;
          };
        };
      };
    };
  }
}

declare namespace google.maps.places {
  interface AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (predictions: AutocompletePrediction[], status: PlacesServiceStatus) => void
    ): void;
  }

  interface PlacesService {
    getDetails(
      request: PlaceDetailsRequest,
      callback: (place: PlaceResult, status: PlacesServiceStatus) => void
    ): void;
  }

  interface AutocompletionRequest {
    input: string;
    types?: string[];
    componentRestrictions?: ComponentRestrictions;
  }

  interface ComponentRestrictions {
    country: string | string[];
  }

  interface AutocompletePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text?: string;
    };
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields: string[];
  }

  interface PlaceResult {
    formatted_address: string;
    address_components: AddressComponent[];
    geometry: PlaceGeometry;
    name: string;
    place_id: string;
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  interface PlaceGeometry {
    location: LatLng;
    viewport: LatLngBounds;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngBounds {
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
  }

  enum PlacesServiceStatus {
    OK = 'OK',
    ZERO_RESULTS = 'ZERO_RESULTS',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    NOT_FOUND = 'NOT_FOUND'
  }
}

export {};