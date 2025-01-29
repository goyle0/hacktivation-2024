'use client';

import { useState } from 'react';

const [recordedAt, setRecordedAt] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm形式
});

// 日時をISO 8601形式に変換する関数
const formatDateToISO = (dateString: string): string => {
    // datetime-local から受け取った値をDateオブジェクトに変換し、ISO 8601形式に変換
    const date = new Date(dateString);
    return date.toISOString();
};

// 他のコードが続く...
