'use client'
import { useEffect, useState } from 'react';

import Image from 'next/image';

const today = new Date().toDateString();

export default function FreeDailyRewards() {
  const [userId, setUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastClaimedAt, setLastClaimedAt] = useState<string | null>(null);

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    if (tgUser.id) {
      setUserId(tgUser.id)

       fetch(`/api/balance?userId=${tgUser.id}`)
       .then((res) => res.json())
       .then((data) => {
        setLastClaimedAt(new Date(data.lastDailyRewardAt).toDateString());
      })
    }
  }, [])

  const handleFreeClaim = async () => {
    const res = await fetch('/api/freeDailyReward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(data.success)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } else {
      setErrorMessage(data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="">
      <div className="flex items-center gap-1 mb-5">
        <h3 className="text-lg font-bold my-text-gray">Daily check-in free</h3>

        <p className="text-sm my-text-white my-bg-gradient px-3 rounded-full">+ 10</p>
      </div>

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

      <div>        
        <button 
        disabled={lastClaimedAt === today}
        onClick={lastClaimedAt === today ? undefined : handleFreeClaim} className={`w-full p-3 rounded-md my-text-white btn-blue4-active btn-translate-active ${lastClaimedAt === today ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient'}`}>
          {lastClaimedAt === today ? "Done" : "Claim Rewards"}
        </button>
      </div>
    </div>
  )
}