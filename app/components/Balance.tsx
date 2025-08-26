'use client'
import React, {useEffect, useState} from "react";

export default function UserBalance() {
    const [balance, setBalance] = useState<number | null>(null);
    const [cachedBalance, setCachedBalance] = useState<number | null>(null);
    
    useEffect(() => {
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

        const cached = localStorage.getItem('cachedBalance');
        if (cached) {
          setCachedBalance(Number(cached));
        }

        if (tgUser.id) {
            fetch(`/api/balance?userId=${tgUser.id}`)
            .then((res) => res.json())
            .then((data) => {
              setBalance(data.balance);
              localStorage.setItem('cachedBalance', data.balance.toString())
            });
        }
    }, []);

    const displayBalance = balance || cachedBalance;

    return (
        <div className='text-center'>
            <p className='font-bold text-3xl/6'>{displayBalance}</p>
            <span className='text-sm font-light my-text-gray'>$PUPPIZEN</span>
        </div>
    )
}