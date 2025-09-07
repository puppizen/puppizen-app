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


// const handleAdWatch = async () => {
//     setLoadingAd(true);
//     setErrorMessage(null);

//     try {
//       const AdController = window.Adsgram.init({ blockId: '14582' });
//       const result = await AdController.show();

//       if (result.done && !result.error) {
//         const res = await fetch('/api/adsReward', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId })
//         });

//         const data = await res.json();
//         setAdsWatched(data.adsWatchedToday);
//       } else {
//         setErrorMessage('Ad not completed or failed to load');
//       } 
      
//       console.log(result);
//     } catch (err) {
//       setErrorMessage('Adsgram error: ' + err);
//     }

//     setLoadingAd(false);
//   };




  // const handleClaimReward = async () => {
  //   setClaiming(true);
  //   setErrorMessage(null);

  //   try {
  //     const res = await fetch('/api/claim-reward', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userId })
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       setSuccessMessage(data.success || "Daily reward claimed");
  //     } else {
  //       setErrorMessage(data.error || 'Claim failed');
  //     }
  //   } catch (err) {
  //     setErrorMessage('Claim error: ' + err);
  //   }

  //   setClaiming(false);
  // };