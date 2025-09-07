'use client'
import Image from 'next/image';

import { useEffect, useState } from 'react';

export default function WatchAdsForReward() {
  const [adsWatched, setAdsWatched] = useState(0);
  const [loadingAd, setLoadingAd] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setErrorMessage(null);

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
        setErrorMessage('Ad not completed or failed to load');
      } 
      
      console.log(result);
    } catch (err) {
      setErrorMessage('Adsgram error: ' + err);
    }

    setLoadingAd(false);
  };

  const handleClaimReward = async () => {
    setClaiming(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.success || "Daily reward claimed");
      } else {
        setErrorMessage(data.error || 'Claim failed');
      }
    } catch (err) {
      setErrorMessage('Claim error: ' + err);
    }

    setClaiming(false);
  };

  return (
    <div className="">
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-8 my-text-gray">Daily check-in with ads</h3>
        {successMessage && (
          <div className="flex items-center gap-1 my-bg-blue my-text-white px-3 py-1 mb-3 w-full rounded-md">
            <Image src='/check-good.svg' width={20} height={20} alt='success'/>
            <p className='text-xs'>
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className='flex items-center gap-1 bg-red-600 my-text-white px-3 py-1 mb-3 w-full rounded-md'>
            <Image src='/error.svg' width={20} height={20} alt='error'/>
            <p className='text-xs'>
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center p-3 rounded-md my-bg-gray mb-3">
          <div className="flex gap-1 items-center">
            <Image src="/television.svg" width={36} height={36} alt="ads" />
            <div className="flex gap-2 items-center my-text-white">
              <p className="">Today: </p>
              <span className="text-xs">{adsWatched || 0} / 5</span>
            </div>
          </div>
          
          <button
            onClick={handleAdWatch}
            disabled={loadingAd || adsWatched >= 5}
            className={`px-4 py-1 rounded-full my-text-white ${
              adsWatched >= 5 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient'
            }`}
          >
            {loadingAd ? 'Loading Ad...' : 'Watch Ad'}
          </button>
        </div>
        
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
