import React from 'react'

export default function DashboardPage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
            <div className="grid gap-6">
                <div className="rounded-lg border p-4">
                    <h2 className="text-xl font-semibold mb-2">今日の活動</h2>
                    <div className="text-2xl font-bold">2,500 歩</div>
                </div>
                <div className="rounded-lg border p-4">
                    <h2 className="text-xl font-semibold mb-2">獲得ポイント</h2>
                    <div className="text-2xl font-bold">250 PT</div>
                </div>
                <div className="rounded-lg border p-4">
                    <h2 className="text-xl font-semibold mb-2">獲得ETH</h2>
                    <div className="text-2xl font-bold">0.01 ETH</div>
                </div>
            </div>
        </div>
    )
}
