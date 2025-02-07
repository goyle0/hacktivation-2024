// グローバルスタイルのインポート
import './globals.css'
// Next.jsのメタデータ型定義のインポート
import type { Metadata } from 'next'
import React from 'react'
// ヘッダーコンポーネントのインポート
import Header from './components/Header'

/**
 * アプリケーションのメタデータ設定
 * SEOやブラウザタブに表示される情報を定義
 */
export const metadata: Metadata = {
    title: 'FITMOVE',
    description: '動いてETHとポイントを獲得しよう！',
}

/**
 * ルートレイアウトコンポーネント
 * すべてのページで共有される共通レイアウトを定義
 * 
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - 子コンポーネント（各ページのコンテンツ）
 * @returns {JSX.Element} 共通レイアウトを含むHTML構造
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <head>
                <script
                    id="google-maps-api-key"
                    dangerouslySetInnerHTML={{
                        __html: `window.NEXT_PUBLIC_GOOGLE_API_KEY="${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}";`,
                    }}
                />
            </head>
            <body>
                {/* グローバルヘッダーコンポーネント */}
                <Header />
                {/* 各ページのコンテンツがここに表示される */}
                {children}
            </body>
        </html>
    )
}
