'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type LeaderboardUser = {
  userId: number;
  username: string;
  balance: number;
  profile_url?: string;
  position: number;
};

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [cachedUsers, setCachedUsers] = useState<LeaderboardUser[]>([]);
  const [userProfile, setUserprofile] = useState<LeaderboardUser | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user.id;

    const cached = localStorage.getItem('cachedUsers');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedUsers(parsed);
      } catch (err) {
        console.error('Failed to parse cached users:', err);
      }
    }

    fetch(`/api/leaderboard?userId=${tgUser}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.topUsers);
        localStorage.setItem('cachedUsers', JSON.stringify(data.topUsers));
        setUserPosition(data.userPosition);
        setUserprofile(data.userProfile);
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err);
      });
  }, []);

  const getBadge = (rank: number) => {
    switch (rank) {
      case 0: return '💎'; // Platinum
      case 1: return '🥇'; // Gold
      case 2: return '🥈'; // Silver
      default: return '🥉'; // Others
    }
  };

  const getReward = (reward: number) => {
    switch (reward) {
      case 0: return '35💎';
      case 1: return '25💎';
      case 2: return '20💎';
      case 3: return '15💎';
      case 4: return '5💎'
      default: return '';
    }
  }

  const displayTopUsers = users.length > 0 ? users : cachedUsers

  return (
    <div>
      <ul className="space-y-2">
        {userProfile && (<div className='flex justify-between items-center my-bg-blue p-3 mb-2 rounded-md'>
          <div className='flex gap-3'>
            <Image src={userProfile.profile_url || "/puppizen-image.png"} width={24} height={24} alt=''></Image>
            <div>
              <span className='font-medium'>{userProfile.username}</span>
              <span className=''>Your position {userPosition}</span>
            </div>
          </div>
          <span className='text-xs font-light'>{userProfile.balance}</span>
        </div>)}
        {displayTopUsers.map((user, index) => (
          <li key={user.userId} className="flex justify-between items-center p-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-light">#{index + 1}</p>
              <span>{getBadge(index)}</span>
              <Image 
                className="my-border-blue rounded-full"
                src={user.profile_url || '/puppizen-image.png'}
                width={24} height={24} alt='' loading='lazy'
              ></Image>
              <p className="flex gap-1 items-center">
                <span className="text-sm">{user.username || `User ${user.userId}`}</span> 
                <span className="my-text-xs">{getReward(index)}</span></p>
            </div>
            <p className="text-sm">{user.balance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}