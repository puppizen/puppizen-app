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
    <div className="p-3">
      <h3 className="text-2xl font-bold mb-4 my-text-gray">🎁 Watch Ad & Earn</h3>

      <p className="flex justify-between items-center my-text-white mb-2">
        <span>
          Today&apos;s free count:
        </span>
        <span>
          {dailyCount || 0} /3
        </span>
      </p>

      <p className="my-text-white mb-4">
        <span>
          Your Balance:
        </span> {earned !== null ? `${earned} points` : 'Loading...'}
      </p>

      <button
        onClick={showAd}
        disabled={loading || dailyCount >= 3}
        className={`w-full px-4 py-2 rounded my-text-white ${
          dailyCount >= 3 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
        }`}
      >
        {loading ? 'Loading Ad...' : 'Watch Ad to Earn'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}