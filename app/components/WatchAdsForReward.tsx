'use client'
import Image from 'next/image';

import { useEffect, useState } from 'react';

export default function WatchAdsForReward() {
  const [userId, setUserId] = useState<number | null>(null);
  const [adsWatched, setAdsWatched] = useState(0);
  const [starsPaidToday, setStarsPaidToday] = useState(0);
  // const [loadingAd, setLoadingAd] = useState(false);
  // const [claiming, setClaiming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    if (tgUser.id) {
      setUserId(tgUser.id)

      fetch(`/api/balance?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAdsWatched(data.adsWatchedToday);
        setStarsPaidToday(data.starsPaidToday);
      })
    }
  }, [])

  const handleAdWatch = async () => {
    const AdController = window.Adsgram.init({blockId: "14582"});
    const result = await AdController.show();

    if (result.done && !result.error) {
      const res = await fetch('/api/adsReward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json()
      setAdsWatched(data.adsWatchedToday)
    } else {
      setErrorMessage("Ads not watched to the end!")
    }

    console.log(result)
  }

  const handleClaimReward = async () => {
    const res = await fetch('/api/claim-reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(data.success || "Daily reward claimed")
    } else {
      setErrorMessage(data.error)
    }
  }

  const handleClaimWithStars = async () => {
    const res = await fetch("/api/invoiceLink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    const { invoiceLink } = await res.json();
    window.Telegram.WebApp.openInvoice(invoiceLink);
  }

  window.Telegram.WebApp.invoiceClosed() 

  const handleClaimRewardStars = async () => {
    const res = await fetch("/api/claimRewardStars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    const data = await res.json();
    if (res.ok) {
      setSuccessMessage(data.success || "Rewards claimed with stars")
    } else {
      setErrorMessage(data.error)
    }
  }

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
              <span className="text-xs">{adsWatched || 0} / 10</span>
            </div>
          </div>
          
          <button
            onClick={handleAdWatch}
            disabled={adsWatched >= 5}
            className={`px-4 py-1 rounded-full my-text-white ${
              adsWatched >= 10 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient'
            }`}
          >
            Watch Ad
          </button>
        </div>
        
        <button
          onClick={handleClaimReward}
          disabled={adsWatched < 10}
          className={`w-full p-3 rounded-md my-text-white mb-3 ${
            adsWatched < 10 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
          }`}
        >
          Claim Reward
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-8 my-text-gray">Daily check-in with stars</h3>
        <button onClick={handleClaimWithStars} className={`p-3 rounded-md w-full my-text-white mb-3 ${
          starsPaidToday >= 5 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient'
        }`}>
          Check-in with 5 stars 
        </button>
        <button onClick={handleClaimRewardStars}
        className={`w-full p-3 rounded-md my-text-white mb-3 ${
          starsPaidToday < 5 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
        }`}>Claim Reward</button>
      </div>
  </div>
  );
}

// {claiming ? 'Claiming...' : 'Claim Reward'}

// await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     chat_id: userId,
//     text: "👋 Welcome back! You can now claim your daily reward.",
//   }),
// });