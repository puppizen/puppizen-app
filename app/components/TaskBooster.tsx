'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type InvoiceClosedEvent = {
  status: 'paid' | 'cancelled';
  slug: string;
}

export default function TaskBooster() {
  const [userId, setUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [taskBooster, setTaskBooster] = useState<number | null>();

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    if (tgUser.id) {
      setUserId(tgUser.id)

      fetch(`/api/balance?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTaskBooster(data.taskBooster);
      })
    }
  }, [])

  const handleClaimWithStars = async () => {
    const res = await fetch("/api/invoiceLinkBoaster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    const { invoiceLink } = await res.json();
    window.Telegram.WebApp.openInvoice(invoiceLink);

    const listener = async (event: InvoiceClosedEvent) => {
      if (event.status === "paid") {

        console.log("Calling api/paymentSuccessful2")
        const res = await fetch("/api/paymentSuccessful", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        if (res.ok) {
          setTaskBooster(data.taskBooster);
          setSuccessMessage("Payment confirmed! You recieved x2 booster.");
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
  return (
    <div>
      <div className="my-bg-lightgray rounded-md px-2 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src={"/boostImage.png"} width={36} height={36} alt='boost'></Image>
            <div className="">
              <p className="text-sm">Boost Task Reward x2</p>
              <p className="mt-0.5">
                <span className="text-xs my-text-white my-bg-gradient px-3 rounded-full">+1000</span>
              </p>
            </div>
          </div>
          <div>
            <button onClick={handleClaimWithStars}
            className={`px-4 py-1 text-sm rounded-full my-text-white flex items-center gap-0.5 ${taskBooster === 2 ? 'bg-green-600 opacity-20' : 'my-bg-gradient btn-blue4-active btn-translate-active'}`}>
              <span>{taskBooster === 2 ? "" : "Buy"}</span>
              <Image src={taskBooster === 2 ? '/check.svg' : '/arrow.svg'} width={18} height={18} alt='go'></Image>
            </button>
          </div>
        </div>
        <p className="my-text-gray mt-2 text-xs px-3 font-extralight"><span className="my-text-white">** </span>Buy this booster and earn twice your rewards when you complete tasks. Also applies to your referral rewards</p>
        {successMessage && (
          <div className="mt-1">
            <p className='text-xs text-green-500'>
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-1">
            <p className='text-xs text-red-500'>
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}