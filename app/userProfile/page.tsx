'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";

type UserData = {
  userId: number,
  username: string,
  profile_url: string,
  balance: number,
  starsBalance: number,
  totalStarsPaid: number,
  adsWatched: number,
  taskCompleted: number,
  referrals: number
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cachedData, setCachedData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    setLoading(true);
    setCachedData(null);

    const cacheKey = `cachedData-${tgUser.id}`

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedData(parsed);
      } catch (err) {
        console.error('Failed to parse cached data', err);
      }
    }

    if(tgUser) {
      fetch(`/api/userData?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setLoading(false);
      })
    }
  }, []);

  const displayData = loading ? cachedData : userData
  
  return (
    <div className="flex flex-col justify-around">
      <h3 className="my-text-gray font-bold text-2xl text-center">My Profile</h3>
      <div>
        {displayData ? (
          <div className="flex flex-col justify-around">
            <div>
              <Image src={displayData.profile_url || '/puppizen-image.png'} width={50} height={50} alt="user photo" className="my-border-gray"/>
              <p className="text-center mt-5">{displayData.username}</p>
            </div>
            <div className="flex flex-col justify-around">
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$PUPPIZEN</span> <span>{displayData.balance}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS</span> <span>{displayData.starsBalance}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS spent</span> <span>{displayData.totalStarsPaid}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Referrals</span> <span>{displayData.referrals}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Task Completed</span> <span>{displayData.taskCompleted}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Ads Watched</span> <span>{displayData.adsWatched}</span></p>
              </div>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  )
}