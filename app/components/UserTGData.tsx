'use client'
import { TonConnectButton } from '@tonconnect/ui-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserTGData() {
  const [user, setUser] = useState({ userId: 0, username: '', photoUrl: '' });

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

  return (
    <div className="flex justify-between">
      <Link href='/userProfile'>
        <div className="flex items-center gap-2 relative">
          {user.photoUrl && (
            <Image
              className="my-border-blue rounded-md ml-1.5"
              width={36}
              height={36}
              src={user.photoUrl}
              alt="User profile"
            />
          )}
          <p className="">{user.username}</p>

          <div className="absolute left-0 -top-0.5">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-red-500"></span>
            </span>
          </div>
        </div>
      </Link>
      <TonConnectButton />
    </div>
  );
}
