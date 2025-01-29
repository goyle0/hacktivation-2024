'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)'
};

const center = {
  lat: 35.6812362,
  lng: 139.7671248
};

const libraries: ("places")[] = ["places"];

export default function MapPage() {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const {
    ready: originReady,
    value: originValue,
    suggestions: { status: originStatus, data: originData },
    setValue: setOriginValue,
    clearSuggestions: clearOriginSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { language: 'ja' },
    debounce: 300,
  });

  const {
    ready: destReady,
    value: destValue,
    suggestions: { status: destStatus, data: destData },
    setValue: setDestValue,
    clearSuggestions: clearDestSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { language: 'ja' },
    debounce: 300,
  });

  const calculateRoute = useCallback(async () => {
    if (!originValue || !destValue) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const [originResults, destResults] = await Promise.all([
        getGeocode({ address: originValue }),
        getGeocode({ address: destValue })
      ]);

      const [originLocation, destLocation] = await Promise.all([
        getLatLng(originResults[0]),
        getLatLng(destResults[0])
      ]);

      const results = await directionsService.route({
        origin: originLocation,
        destination: destLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }, [originValue, destValue]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="出発地"
              value={originValue}
              onChange={(e) => setOriginValue(e.target.value)}
              ref={originRef}
              className="w-full p-2 border rounded"
              disabled={!originReady}
            />
            {originStatus === "OK" && (
              <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-w-md">
                {originData.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setOriginValue(description, false);
                      clearOriginSuggestions();
                    }}
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="目的地"
              value={destValue}
              onChange={(e) => setDestValue(e.target.value)}
              ref={destinationRef}
              className="w-full p-2 border rounded"
              disabled={!destReady}
            />
            {destStatus === "OK" && (
              <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-w-md">
                {destData.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDestValue(description, false);
                      clearDestSuggestions();
                    }}
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={calculateRoute}
          >
            ルート検索
          </button>
        </div>
      </div>

      <div className="flex-1">
        <LoadScript
          googleMapsApiKey="AIzaSyCNDW8Tmx_FIpsLXhYQhpWp9Tgo5qf3Ivg"
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
