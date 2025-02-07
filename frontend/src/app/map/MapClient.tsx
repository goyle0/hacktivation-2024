"use client";

/**
 * 地図表示と経路検索機能を提供するクライアントコンポーネント
 * Google Maps APIを使用して、経路の検索・表示・保存機能を実装
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

// 地図コンテナのスタイル設定
// ヘッダーの高さ(64px)を考慮した全画面表示
const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 64px)'
};

// 地図の初期中心座標（東京）
const center = {
    lat: 35.6812362,
    lng: 139.7671248
};

// Google Maps APIで使用するライブラリの指定
const libraries: ("places")[] = ["places"];

/**
 * 地図コンポーネント
 * 経路検索、表示、保存機能を提供する
 */
export default function MapClient() {
    // 経路情報の状態管理
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState<string>("");          // 距離
    const [duration, setDuration] = useState<string>("");          // 所要時間
    const originRef = useRef<HTMLInputElement>(null);             // 出発地入力フィールドの参照
    const destinationRef = useRef<HTMLInputElement>(null);        // 目的地入力フィールドの参照

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

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        // 環境変数の読み込み状態をデバッグ
        console.log('NEXT_PUBLIC_GOOGLE_API_KEY status:', {
            isDefined: typeof process.env.NEXT_PUBLIC_GOOGLE_API_KEY !== 'undefined',
            isEmpty: process.env.NEXT_PUBLIC_GOOGLE_API_KEY === '',
            length: process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.length
        });
    }, []);

    /**
     * 経路計算処理
     * 出発地と目的地の住所から経路情報を取得し、地図上に表示
     */
    const calculateRoute = useCallback(async () => {
        if (!originValue || !destValue || !isLoaded) {
            return;
        }

        try {
            const directionsService = new google.maps.DirectionsService();

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
            setDistance(results.routes[0].legs[0].distance?.text || "");
            setDuration(results.routes[0].legs[0].duration?.text || "");
        } catch (error) {
            console.error('Error calculating route:', error);
        }
    }, [originValue, destValue]);

    /**
     * 経路保存処理
     * 計算された経路情報をバックエンドAPIに送信して保存
     */
    const saveRoute = async () => {
        if (!directionsResponse) return;

        try {
            const route = {
                origin: originValue,
                destination: destValue,
                distance: distance,
                duration: duration,
                timestamp: new Date().toISOString(),
            };

            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(route),
            });

            if (!response.ok) {
                throw new Error('Failed to save route');
            }

            alert('移動履歴を保存しました！');

            // フォームをリセット
            setOriginValue("");
            setDestValue("");
            setDirectionsResponse(null);
            setDistance("");
            setDuration("");
        } catch (error) {
            console.error('Error saving route:', error);
            alert('移動履歴の保存に失敗しました。');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold mb-4">移動履歴を記録</h1>
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

                {directionsResponse && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg">距離: {distance}</p>
                                <p className="text-lg">所要時間: {duration}</p>
                            </div>
                            <button
                                onClick={saveRoute}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                この移動を記録
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <LoadScript
                    googleMapsApiKey={(window as any).NEXT_PUBLIC_GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}
                    libraries={libraries}
                    onLoad={() => {
                        const apiKey = (window as any).NEXT_PUBLIC_GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
                        if (!apiKey) {
                            console.error('Google Maps APIキーが設定されていません。.env.localファイルを確認してください。');
                        } else {
                            console.log('Google Maps APIキーが正常に読み込まれました。');
                        }
                    }}
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
