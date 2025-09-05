'use client'

import { useEffect, useState } from 'react';

export default function WatchAdsForReward() {
  const [adsWatched, setAdsWatched] = useState(0);
  const [loadingAd, setLoadingAd] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = typeof window !== 'undefined'
    ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    : null;

  useEffect(() => {
  const fetchStatus = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/balance?userId=${userId}`);
      const data = await res.json();
      setAdsWatched(data.adsWatchedToday || 0);
    } catch (err) {
      console.error('Failed to fetch user status:', err);
    }
  };

  fetchStatus();
}, [userId]);

  const handleAdWatch = async () => {
    setLoadingAd(true);
    setError(null);

    try {
      const AdController = window.Adsgram.init({ blockId: '14582' });
      const result = await AdController.show();

      if (result.done && !result.error) {
        const res = await fetch('/api/adsReward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        const data = await res.json();
        setAdsWatched(data.adsWatchedToday);
      } else {
        setError('Ad not completed or failed to load');
      } 
      
      console.log(result);
    } catch (err) {
      setError('Adsgram error: ' + err);
    }

    setLoadingAd(false);
  };

  const handleClaimReward = async () => {
    setClaiming(true);
    setError(null);

    try {
      const res = await fetch('/api/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (res.ok) {
        setAdsWatched(0);
      } else {
        setError(data.error || 'Claim failed');
      }
    } catch (err) {
      setError('Claim error: ' + err);
    }

    setClaiming(false);
  };

  return (
    <div className="p-2">
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-8 my-text-gray">Daily check-in with ads</h3>

        <p className="flex justify-between items-center my-text-white mb-5 font-normal text-sm">
          <span>
            Today&apos;s free count:
          </span>
          <span>
            {adsWatched || 0} / 5
          </span>
        </p>

        <button
          onClick={handleAdWatch}
          disabled={loadingAd || adsWatched >= 5}
          className={`w-full p-3 rounded my-text-white mb-3 ${
            adsWatched >= 5 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
          }`}
        >
          {loadingAd ? 'Loading Ad...' : 'Watch Ad'}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <button
          onClick={handleClaimReward}
          disabled={adsWatched < 5 || claiming}
          className={`w-full p-3 rounded my-text-white mb-3 ${
            adsWatched < 5 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
          }`}
        >
          {claiming ? 'Claiming...' : 'Claim Reward'}
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-8 my-text-gray">Daily check-in with stars</h3>
      </div>
  </div>
  );
}
