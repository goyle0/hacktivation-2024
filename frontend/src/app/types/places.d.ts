declare module 'use-places-autocomplete' {
    interface Options {
        requestOptions?: {
            language?: string;
        };
        debounce?: number;
    }

    interface Suggestions<T> {
        status: string;
        data: T[];
    }

    interface Place {
        place_id: string;
        description: string;
    }

    interface UsePlacesAutocompleteResult {
        ready: boolean;
        value: string;
        suggestions: Suggestions<Place>;
        setValue: (value: string, shouldFetch?: boolean) => void;
        clearSuggestions: () => void;
    }

    export default function usePlacesAutocomplete(options?: Options): UsePlacesAutocompleteResult;
    export function getGeocode(args: { address: string }): Promise<google.maps.GeocoderResult[]>;
    export function getLatLng(result: google.maps.GeocoderResult): Promise<google.maps.LatLng>;
}
