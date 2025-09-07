'use client'
import Image from 'next/image';
import Link from 'next/link';

export default function WatchAdsForReward() {

  const handleResetCount = async () => {
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    
    const res = await fetch('/api/resetcount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tgUserId })
    });

    if (res.ok) {
      window.location.href = '/dailyReward';
    }
  };

  return (
    <div className='mt-10'>
      <div className="flex flex-row justify-between items-center p-3 rounded-md my-bg-gradient">
        <div className='flex flex-row gap-3'>
          <Image src='/calender.svg' width={20} height={20} alt='' />
          <span className='font-medium'>Daily Check-in</span>
        </div>
        <Link href="/dailyReward "
        onClick={handleResetCount}
        className="rounded-full my-bg-white my-text-black px-4 py-1">
          Claim
        </Link>
      </div>
    </div>
  );
}
