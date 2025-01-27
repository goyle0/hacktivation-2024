import React from 'react'
import { Button } from '../../../components/ui/button'

export default function ProfilePage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
            <div className="max-w-md mx-auto">
                <div className="rounded-lg border p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">ウォレットアドレス</label>
                        <div className="p-2 bg-gray-50 rounded border">
                            <code className="text-sm">0x1234...5678</code>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">累計獲得ETH</label>
                        <div className="text-2xl font-bold">0.25 ETH</div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">累計獲得ポイント</label>
                        <div className="text-2xl font-bold">5,250 PT</div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">継続日数</label>
                        <div className="text-2xl font-bold">7日</div>
                    </div>
                    <Button className="w-full">
                        ウォレット接続
                    </Button>
                </div>
            </div>
        </div>
    )
}
