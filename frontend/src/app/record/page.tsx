'use client'

import React, { useState } from 'react'

export default function 記録ページ() {
    const [移動日時, 設定移動日時] = useState('')
    const [移動手段, 設定移動手段] = useState('徒歩')
    const [移動距離, 設定移動距離] = useState('')
    const [獲得ETH, 設定獲得ETH] = useState('')
    const [経路, 設定経路] = useState(null) // マップの経路情報（後で実装）

    const 送信処理 = (e: React.FormEvent) => {
        e.preventDefault()
        // データの送信処理をここに追加します（後で実装）
        console.log({
            移動日時,
            移動手段,
            移動距離,
            獲得ETH,
            経路,
        })
    }

    return (
        <div className="min-h-screen bg-white p-4">
            <h1 className="text-2xl font-bold mb-4">移動履歴を記録する</h1>
            <form className="space-y-4" onSubmit={送信処理}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">移動日時</label>
                    <input
                        type="datetime-local"
                        value={移動日時}
                        onChange={(e) => 設定移動日時(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">移動手段</label>
                    <select
                        value={移動手段}
                        onChange={(e) => 設定移動手段(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    >
                        <option value="徒歩">徒歩</option>
                        <option value="自転車">自転車</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">移動距離（km）</label>
                    <input
                        type="number"
                        step="0.01"
                        value={移動距離}
                        onChange={(e) => 設定移動距離(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">獲得したETH</label>
                    <input
                        type="number"
                        step="0.0001"
                        value={獲得ETH}
                        onChange={(e) => 設定獲得ETH(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">移動経路</label>
                    {/* マップコンポーネントのプレースホルダー */}
                    <div className="mt-1 w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">マップをここに表示</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full"
                >
                    保存する
                </button>
            </form>
        </div>
    )
}
