'use client'
import Image from 'next/image';

import { useEffect, useState } from 'react';

type InvoiceClosedEvent = {
  status: 'paid' | 'cancelled';
  slug: string;
};

export default function PayStarsForReward() {
  const [userId, setUserId] = useState<number | null>(null);
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
        setStarsPaidToday(data.starsPaidToday);
      })
    }
  }, [])

  const handleClaimWithStars = async () => {
    const res = await fetch("/api/invoiceLink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    const { invoiceLink } = await res.json();
    window.Telegram.WebApp.openInvoice(invoiceLink);

    const listener = async (event: InvoiceClosedEvent) => {
      if (event.status === "paid") {

        console.log("Calling api/paymentSuccessful")
        const res = await fetch("/api/paymentSuccessful", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        if (res.ok) {
          setStarsPaidToday(data.starsPaidToday);
          setSuccessMessage("Payment confirmed! You can now claim your reward.");
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        } else {
          setErrorMessage("Payment confirmed, but update failed.");
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      } else {
        setErrorMessage("Invoice was closed without payment.");
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }

      window.Telegram.WebApp.offEvent("invoiceClosed", listener);
    };

    window.Telegram.WebApp.onEvent("invoiceClosed", listener);
  }

  const handleClaimRewardStars = async () => {
    const res = await fetch("/api/claimRewardStars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    const data = await res.json();
    if (res.ok) {
      setSuccessMessage(data.success)
    } else {
      setErrorMessage(data.error)
    }
  }

  return (
    <div className="">
      <div>
        <h3 className="text-xl font-bold mb-8 my-text-gray">Daily check-in with stars</h3>

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

        <button onClick={handleClaimWithStars} 
        className={`p-3 rounded-md w-full my-text-white mb-3 ${
          starsPaidToday >= 20 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient'
        }`}>
          Check-in with 20 stars 
        </button>
        <button onClick={handleClaimRewardStars}
        className={`w-full p-3 rounded-md my-text-white mb-3 ${
          starsPaidToday < 20 ? 'my-bg-gray cursor-not-allowed' : 'my-bg-gradient active:my-bg-white'
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