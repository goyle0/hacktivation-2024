import React from 'react'

export default function RewardsPage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">報酬</h1>
            <div className="grid gap-6">
                <div className="rounded-lg border p-4">
                    <h2 className="text-xl font-semibold mb-4">今月の獲得報酬</h2>
                    <div className="grid gap-4">
                        <div className="flex justify-between items-center">
                            <span>ETH</span>
                            <span className="text-xl font-bold">0.05 ETH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>ポイント</span>
                            <span className="text-xl font-bold">1,250 PT</span>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border p-4">
                    <h2 className="text-xl font-semibold mb-4">報酬履歴</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold">2025/01/26</div>
                                <div className="text-sm text-gray-500">歩数達成ボーナス</div>
                            </div>
                            <div className="text-right">
                                <div>0.01 ETH</div>
                                <div>250 PT</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold">2025/01/25</div>
                                <div className="text-sm text-gray-500">継続ボーナス</div>
                            </div>
                            <div className="text-right">
                                <div>0.01 ETH</div>
                                <div>300 PT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
