import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import Header from './components/Header'

export const metadata: Metadata = {
    title: 'FITMOVE',
    description: '動いてETHとポイントを獲得しよう！',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body>
                <Header />
                {children}
            </body>
        </html>
    )
}
