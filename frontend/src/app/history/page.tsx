'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MovementRecordABI } from '@/types/contracts';

interface Movement {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  travel_mode: string;
  timestamp: string;
  memo?: string;
  created_at: string;
  eth_amount?: string;
}

export default function HistoryPage() {
  const [groupedMovements, setGroupedMovements] = useState<{ [key: string]: Movement[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  // MetaMaskとの接続処理
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMaskをインストールしてください");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("ウォレット接続に失敗しました");
    }
  };

  // Eth受け取り申請処理
  const claimEth = async (movement: Movement) => {
    if (!isConnected) {
      setError("先にMetaMaskを接続してください");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("Contract address is not configured");
      }
      
      const contract = new ethers.Contract(contractAddress, MovementRecordABI, signer);

      // スマートコントラクトの関数を呼び出し
      const ethAmount = parseFloat(movement.distance) / 800 * 0.00001;
      const tx = await contract.claimReward(
        movement.origin,
        movement.destination,
        movement.distance,
        movement.timestamp,
        ethers.utils.parseEther(ethAmount.toFixed(8))
      );

      await tx.wait();
      alert('Eth受け取り申請が完了しました');
    } catch (err) {
      console.error("Failed to claim ETH:", err);
      setError("Eth受け取り申請に失敗しました");
    }
  };

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/routes');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        // 記録日時でグループ化
        const grouped = data.reduce((groups: { [key: string]: Movement[] }, movement: Movement) => {
          const date = new Date(movement.timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(movement);
          return groups;
        }, {});

        // 各グループ内を記録時間順にソート
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a: Movement, b: Movement) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });

        setGroupedMovements(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const formatDateTime = (dateString: string) => {
    try {
      if (!dateString) {
        throw new Error('日時が指定されていません');
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('不正な日時形式です');
      }

      // JSTに変換(UTCからの9時間オフセット)
      const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));

      const year = jstDate.getFullYear();
      const month = String(jstDate.getMonth() + 1).padStart(2, '0');
      const day = String(jstDate.getDate()).padStart(2, '0');
      const hours = String(jstDate.getHours()).padStart(2, '0');
      const minutes = String(jstDate.getMinutes()).padStart(2, '0');
      const seconds = String(jstDate.getSeconds()).padStart(2, '0');

      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('日時のフォーマットエラー:', error, dateString);
      return '不明な日時';
    }
  };

  const formatGroupDate = (dateString: string) => {
    try {
      if (!dateString) {
        throw new Error('日時が指定されていません');
      }

      const parts = dateString.split('-');
      if (parts.length !== 3) {
        throw new Error('不正な日付形式です');
      }
      
      const [year, month, day] = parts;
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);
      const numDay = parseInt(day, 10);

      if (isNaN(numYear) || isNaN(numMonth) || isNaN(numDay)) {
        throw new Error('不正な日付形式です');
      }

      return `${numYear}年${numMonth}月${numDay}日`;
    } catch (error) {
      console.error('日付のフォーマットエラー:', error, dateString);
      return '不明な日付';
    }
  };

  const translateTravelMode = (mode: string) => {
    const modes: { [key: string]: string } = {
      'WALKING': '徒歩',
    };
    return modes[mode] || mode;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">移動履歴</h1>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          MetaMaskと接続
        </button>
      ) : (
        <p className="text-sm text-green-600 mb-4">
          接続済み: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <div className="space-y-6">
        {Object.keys(groupedMovements)
          .sort((a, b) => {
            // 日付文字列をDateオブジェクトに変換してから比較
            const [yearA, monthA, dayA] = a.split('-');
            const [yearB, monthB, dayB] = b.split('-');
            const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
            const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));
            return dateB.getTime() - dateA.getTime();
          })
          .map((date) => (
            <div key={date} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{formatGroupDate(date)}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">記録日時</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出発地</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目的地</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">移動距離</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">獲得Eth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eth受け取り申請</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メモ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedMovements[date].map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(movement.timestamp)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {movement.origin}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.destination}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.distance}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                          {(parseFloat(movement.distance) / 800 * 0.00001).toFixed(8) + ' ETH'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                            onClick={() => claimEth(movement)}
                            disabled={!isConnected}
                          >
                            Eth受け取り申請
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <textarea
                            defaultValue={movement.memo}
                            placeholder="メモを入力"
                            className="w-full p-2 border rounded"
                            rows={2}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        {Object.keys(groupedMovements).length === 0 && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center text-gray-500">
              記録がありません
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
