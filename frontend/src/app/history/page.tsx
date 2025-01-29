'use client';

import { useEffect, useState } from 'react';

interface Movement {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  travel_mode: string;
  memo: string;
  created_at: string;
  recorded_at: string;
}

export default function HistoryPage() {
  const [groupedMovements, setGroupedMovements] = useState<{ [key: string]: Movement[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/movements');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        // 記録日時でグループ化
        const grouped = data.reduce((groups: { [key: string]: Movement[] }, movement: Movement) => {
          // 記録日時をDateオブジェクトに変換してから日付文字列を生成
          const dateKey = movement.recorded_at ? movement.recorded_at.split('T')[0] : '不明';

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }
          groups[dateKey].push(movement);
          return groups;
        }, {});

        // 各グループ内を記録時間順にソート
        Object.keys(grouped).forEach(date => {
          grouped[date].sort((a: Movement, b: Movement) =>
            new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
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

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('日時のフォーマットエラー:', error);
      return '--:--';
    }
  };

  const translateTravelMode = (mode: string) => {
    const modes: { [key: string]: string } = {
      'WALKING': '徒歩',
      'BICYCLING': '自転車',
      'DRIVING': '車'
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

      <div className="space-y-6">
        {Object.keys(groupedMovements)
          .sort((a, b) => {
            // 日付文字列をDateオブジェクトに変換してから比較
            return new Date(b).getTime() - new Date(a).getTime();
          })
          .map((date) => (
            <div key={date} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">記録時刻</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出発地</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目的地</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">移動距離</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">移動手段</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メモ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedMovements[date].map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(movement.recorded_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.origin}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.destination}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.distance}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {translateTravelMode(movement.travel_mode)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {movement.memo}
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
