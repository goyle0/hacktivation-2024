import React from 'react'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <main className="flex flex-col items-center justify-center min-h-screen text-black">
                <h1 className="text-3xl font-bold mb-4">FITMOVEへようこそ</h1>
                <p className="text-xl">動いてETHとポイントを獲得しよう！</p>
                <Link href="/record">
                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full">記録する</button>
                </Link>
            </main>
        </div>
    )
}
