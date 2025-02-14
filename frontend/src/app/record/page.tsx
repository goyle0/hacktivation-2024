'use client';

/**
 * 移動記録ページコンポーネント
 * Google Mapsを使用して移動経路を記録し、バックエンドに保存する機能を提供
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { ethers } from 'ethers';
import type { ExternalProvider } from '@ethersproject/providers';

// Google Maps APIで使用するライブラリの指定
const libraries: ("places")[] = ["places"];
// Google Maps APIキーの取得
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

// APIキーが設定されていない場合のエラー表示
if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
    console.error('Google Maps APIキーが設定されていません。.env.localファイルを確認してください。');
}

// 地図コンテナのスタイル設定
const containerStyle = {
    width: '100%',
    height: '400px'
};

// 地図の初期中心座標（福岡）
const center = {
    lat: 33.5902,
    lng: 130.4205
};

/**
 * 移動記録ページのメインコンポーネント
 * 出発地・目的地の入力、経路の表示、記録の保存機能を提供
 */
export default function RecordPage() {
    // Next.jsのルーター
    const router = useRouter();

    // Google Maps APIのロード状態管理
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
        libraries: libraries,
    });

    // 記録日時の状態管理（現在時刻で初期化）
    const [recordedAt, setRecordedAt] = useState<string>(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        return new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 19);
    });

    // 経路情報の状態管理
    const [distance, setDistance] = useState<string>("");      // 移動距離
    const [duration, setDuration] = useState<string>("");      // 所要時間
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);  // 経路情報
    const [error, setError] = useState<string>("");           // エラーメッセージ

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

    /**
     * 経路計算処理
     * 出発地と目的地の住所から経路情報を取得
     */
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
                travelMode: google.maps.TravelMode.WALKING,
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
    }, [originValue, destValue]);

    useEffect(() => {
        if (originValue && destValue) {
            calculateRoute();
        }
    }, [originValue, destValue, calculateRoute]);

    /**
     * 日付文字列をISO形式に変換
     * タイムゾーンを考慮して変換を行う
     * @param dateString - 変換する日付文字列
     * @returns ISO形式の日付文字列
     */
    const formatDateToISO = (dateString: string): string => {
        const date = new Date(dateString);
        // タイムゾーンオフセットを考慮して変換
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset).toISOString();
    };

    /**
     * 記録保存処理
     * 入力された移動記録をバックエンドAPIに送信
     */
    const [isProcessing, setIsProcessing] = useState(false);

    // 移動記録の保存処理
    const handleSubmit = async () => {
        if (!originValue || !destValue || !distance || !recordedAt) {
            alert('全ての項目を入力してください。');
            return;
        }

        try {
            setIsProcessing(true);

            // バックエンドAPIに移動記録を保存
            await fetch('http://localhost:3003/api/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: originValue,
                    destination: destValue,
                    distance: distance,
                    timestamp: new Date(recordedAt).toISOString(),
                }),
            });

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
                return new Date(now.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 19);
            });

            alert('移動履歴を記録しました。履歴画面から承認申請を行ってください。');
            router.push('/history');
        } catch (error) {
            console.error('Error saving record:', error);
            setError(error instanceof Error ? error.message : '移動記録の保存に失敗しました');
        } finally {
            setIsProcessing(false);
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
                    <label className="block text-sm font-medium mb-2">記録日時</label>
                    <input
                        type="datetime-local"
                        value={recordedAt}
                        onChange={(e) => {
                            const value = e.target.value;
                            // 秒を付加して保存
                            setRecordedAt(value.length > 16 ? value : value + ':00');
                        }}
                        className="w-full p-2 border rounded"
                        step="1"  // 秒単位の入力を許可
                    />
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
                    disabled={isProcessing}
                    className={`w-full px-4 py-2 text-white rounded ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                        }`}
                >
                    {isProcessing ? '処理中...' : '記録を保存'}
                </button>
            </div>
        </div>
    );
}
