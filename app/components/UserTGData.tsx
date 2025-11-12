'use client'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function UserTGData() {
  const [user, setUser] = useState({ userId: 0, username: '', photoUrl: '' });
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    
    if (tgUser?.id && !tgUser?.is_bot) {
      const username =
        tgUser.username && tgUser.username.length > 25
          ? `${tgUser.username.slice(0, 15)}...${tgUser.username.slice(-10)}`
          : tgUser.username || `user_${tgUser.id}`;

      setUser({
        userId: tgUser.id,
        username: username,
        photoUrl: tgUser.photo_url || ''
      });

      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: tgUser.id,
          username: tgUser.username,
          profile_url: tgUser.photo_url,
          isBot: tgUser.is_bot
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('User API response:', data);
        })
        .catch(err => {
          console.error('User creation failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    const wallet = tonConnectUI.wallet;

    if (wallet?.account?.address && user.userId !== 0) {
      fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          walletAddress: wallet.account.address
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Wallet saved:', data);
        })
        .catch(err => {
          console.error('Wallet save failed:', err);
        });
    }
  }, [tonConnectUI.wallet, user.userId])

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        {user.photoUrl && (
          <Image
            className="my-border-blue rounded-full"
            width={36}
            height={36}
            src={user.photoUrl}
            alt="User profile"
          />
        )}
        <p className="">{user.username}</p>

        {/* <div className="absolute left-0 -top-0.5">
          <span className="relative flex items-center justify-center size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-red-500"></span>
          </span>
        </div> */}
      </div>
      <TonConnectButton />
    </div>
  );
}

// const handleSend = async () => {
  //   try {
  //     const transaction = {
  //       validUntil: Math.floor(Date.now() / 1000) + 60,
  //       messages: [
  //         {
  //           address: "UQCAngnr4rdL1TDFfZipwKArn__G_TH2Rg1QO9wjR3MuzALz",
  //           amount: "10000000"
  //         },
  //       ],
  //     };

  //     const result = await tonConnectUI.sendTransaction(transaction);

  //     if (result?.boc) {
  //       const res = await fetch("/api/tonTransaction", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           userId: user.userId,
  //           destinationAddress: "UQCAngnr4rdL1TDFfZipwKArn__G_TH2Rg1QO9wjR3MuzALz",
  //           expectedAmountNanoTON: "10000000",
  //           approximateTimestamp: Math.floor(Date.now() / 1000),
  //         }),
  //       });

  //       const data = await res.json();

  //       if (data.success) {
  //         // ✅ Transaction verified — show reward success
  //         console.log("Reward granted to:", data.actualSender);
  //       } else {
  //         // ❌ Transaction not found or invalid
  //         console.log("Transaction verification failed");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //   }
  // };

