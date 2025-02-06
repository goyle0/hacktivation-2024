// 必要なReactコンポーネントとNext.jsの機能をインポート
import React from 'react'
import Link from 'next/link' // ページ間のナビゲーション用コンポーネント

/**
 * ホームページコンポーネント
 * アプリケーションのメインランディングページを表示
 * @returns {JSX.Element} ホームページのUIを返す
 */
export default function Home() {
    return (
        // メインコンテナ：最小画面高さいっぱいに白背景で表示
        <div className="min-h-screen bg-white">
            {/* メインコンテンツ：中央揃えで縦方向にコンテンツを配置 */}
            <main className="flex flex-col items-center justify-center min-h-screen text-black">
                {/* アプリケーションタイトル */}
                <h1 className="text-3xl font-bold mb-4">FITMOVEへようこそ</h1>
                {/* アプリケーションの説明文 */}
                <p className="text-xl">動いてETHとポイントを獲得しよう！</p>
                {/* 記録ページへのリンク */}
                <Link href="/record">
                    {/* アクションボタン：青色の丸みを帯びたデザイン */}
                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full">記録する</button>
                </Link>
            </main>
        </div>
    )
}
