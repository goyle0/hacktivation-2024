'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const libraries: ("places")[] = ["places"];
const API_KEY = "AIzaSyCNDW8Tmx_FIpsLXhYQhpWp9Tgo5qf3Ivg";

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 33.5902,
    lng: 130.4205
};

type TransportMode = 'WALKING' | 'BICYCLING' | 'DRIVING';

export default function RecordPage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        libraries: libraries,
    });

    const [recordedAt, setRecordedAt] = useState<string>(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        return new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
    });

    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [transportMode, setTransportMode] = useState<TransportMode>('WALKING');
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [error, setError] = useState<string>("");

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

        setError("");
        try {
            const [originResults, destResults] = await Promise.all([
                getGeocode({ address: originValue }),
                getGeocode({ address: destValue })
            ]);

            const [originLocation, destLocation] = await Promise.all([
                getLatLng(originResults[0]),
                getLatLng(destResults[0])
            ]);

            const directionsService = new google.maps.DirectionsService();
            const results = await directionsService.route({
                origin: originLocation,
                destination: destLocation,
                travelMode: google.maps.TravelMode[transportMode],
            });

            setDirectionsResponse(results);
            setDistance(results.routes[0].legs[0].distance?.text || "");
            setDuration(results.routes[0].legs[0].duration?.text || "");
        } catch (error) {
            console.error('Error calculating route:', error);
            setError("経路の計算ができませんでした。別の経路を試してください。");
            setDirectionsResponse(null);
            setDistance("");
            setDuration("");
        }
    }, [originValue, destValue, transportMode]);

    useEffect(() => {
        if (originValue && destValue) {
            calculateRoute();
        }
    }, [originValue, destValue, transportMode, calculateRoute]);

    const formatDateToISO = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString();
    };

    const handleSubmit = async () => {
        if (!originValue || !destValue || !distance || !recordedAt) {
            alert('全ての項目を入力してください。');
            return;
        }

        try {
            const record = {
                origin: originValue,
                destination: destValue,
                distance: distance,
                duration: duration,
                transportMode: transportMode,
                timestamp: formatDateToISO(recordedAt),
            };

            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(record),
            });

            if (!response.ok) {
                throw new Error('保存に失敗しました。時間をおいて再度お試しください。');
            }

            alert('移動記録を保存しました！');

            // フォームをリセット
            setOriginValue("");
            setDestValue("");
            setDistance("");
            setDuration("");
            setDirectionsResponse(null);
            setError("");
            setRecordedAt(() => {
                const now = new Date();
                const offset = now.getTimezoneOffset();
                return new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
            });
        } catch (error) {
            console.error('Error saving record:', error);
            setError(error instanceof Error ? error.message : '移動記録の保存に失敗しました');
        }
    };

    if (!isLoaded) {
        return <div className="container mx-auto p-4">読み込み中...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">移動記録</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">日時</label>
                    <input
                        type="datetime-local"
                        value={recordedAt}
                        onChange={(e) => setRecordedAt(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">移動手段</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="WALKING"
                                checked={transportMode === 'WALKING'}
                                onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                                className="mr-2"
                            />
                            徒歩
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="BICYCLING"
                                checked={transportMode === 'BICYCLING'}
                                onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                                className="mr-2"
                            />
                            自転車
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="DRIVING"
                                checked={transportMode === 'DRIVING'}
                                onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                                className="mr-2"
                            />
                            車
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">出発地</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="出発地を入力"
                            value={originValue}
                            onChange={(e) => setOriginValue(e.target.value)}
                            className="w-full p-2 border rounded"
                            disabled={!isLoaded || !originReady}
                        />
                        {originStatus === "OK" && (
                            <ul className="absolute z-10 bg-white border rounded mt-1 w-full">
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
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">目的地</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="目的地を入力"
                            value={destValue}
                            onChange={(e) => setDestValue(e.target.value)}
                            className="w-full p-2 border rounded"
                            disabled={!isLoaded || !destReady}
                        />
                        {destStatus === "OK" && (
                            <ul className="absolute z-10 bg-white border rounded mt-1 w-full">
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
                </div>

                <div className="rounded overflow-hidden shadow-lg">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                    >
                        {directionsResponse && (
                            <DirectionsRenderer directions={directionsResponse} />
                        )}
                    </GoogleMap>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {distance && (
                    <div className="mt-4">
                        <p className="text-lg">移動距離: {distance}</p>
                        {duration && <p className="text-lg">所要時間: {duration}</p>}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    保存
                </button>
            </div>
        </div>
    );
}
