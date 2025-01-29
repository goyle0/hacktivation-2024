declare module "use-places-autocomplete" {
    export interface Suggestion {
        place_id: string;
        description: string;
    }

    export interface Suggestions {
        status: string;
        data: Suggestion[];
    }

    export interface UsePlacesAutocomplete {
        ready: boolean;
        value: string;
        suggestions: Suggestions;
        setValue: (value: string, shouldFetchData?: boolean) => void;
        clearSuggestions: () => void;
    }

    const usePlacesAutocomplete: () => UsePlacesAutocomplete;
    export default usePlacesAutocomplete;

    export function getGeocode(args: { address: string }): Promise<any>;
    export function getLatLng(result: any): Promise<{ lat: number; lng: number }>;
}
