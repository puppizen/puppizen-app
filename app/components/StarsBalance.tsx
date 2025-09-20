'use client'
import React, {useEffect, useState} from "react";

export default function UserBalance() {
  const [starsBalance, setStarsBalance] = useState<number | null>(null);
  const [cachedStarsBalance, setCachedStarsBalance] = useState<number | null>(null);
  
  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    const cacheKeyStars = `cachedStarsBalance-${tgUser.id}`
    const cachedStars = localStorage.getItem(cacheKeyStars);
    if (cachedStars) {
      setCachedStarsBalance(Number(cachedStars));
    }

    if (tgUser.id) {
      fetch(`/api/balance?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStarsBalance(data.starsBalance);
        localStorage.setItem(cacheKeyStars, data.starsBalance.toString())
      });
    }
  }, []);

  const displayStarsBalance = starsBalance || cachedStarsBalance

  return (
    <div className="text-center">
      <p className="font-bold text-3xl/6">{displayStarsBalance}</p>
      <span className="text-sm font-light text-yellow-500">STARS</span>
    </div>
  )
}
