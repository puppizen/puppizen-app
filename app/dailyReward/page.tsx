'use client'

import { useEffect, useState } from 'react';

export default function AdsgramReward() {
  const [loading, setLoading] = useState(false);
  const [earned, setEarned] = useState<number | null>(null);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const userId = typeof window !== 'undefined'
    ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    : null;

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId) return;
      const res = await fetch('/api/adsReward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setEarned(data.balance);
      setDailyCount(data.dailyCount);
    };
    
    fetchStatus();
  }, [userId]);

  const showAd = async () => {
    setLoading(true);
    setError(null);

    try {
      const AdController = window.Adsgram.init({
        blockId: 'int-14464' // Replace with your actual Adsgram block ID
      });

      const result = await AdController.show();

      if (result.done && !result.error) {
        const res = await fetch('/api/adsReward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        const data = await res.json();

        if (res.ok) {
          setEarned(data.Balance);
          setDailyCount(data.dailyCount);
        } else {
          setError(data.error || 'Reward failed');
        }
      } else {
        setError('Ad not completed or failed to load');
      }
    } catch (err) {
      setError('Adsgram error: ' + err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">🎁 Watch Ad & Earn</h2>

      <p className="text-gray-700 mb-2">
        Daily Rewards: {dailyCount}/3
      </p>

      <p className="text-gray-700 mb-4">
        Your Balance: {earned !== null ? `${earned} points` : 'Loading...'}
      </p>

      <button
        onClick={showAd}
        disabled={loading || dailyCount >= 3}
        className={`px-4 py-2 rounded text-white ${
          dailyCount >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Loading Ad...' : 'Watch Ad to Earn'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}