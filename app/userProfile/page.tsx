'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type UserData = {
  userId: number,
  username: string,
  profile_url: string,
  balance: number,
  starsBalance: number,
  totalStarsPaid: number,
  totalAdsWatched: number,
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
      fetch(`/api/userdata?userId=${tgUser.id}`)
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
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end">
        <Link href="/" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>
      <h3 className="my-text-gray font-bold text-2xl text-center mb-8">My Profile</h3>
      <div className="flex-1">
        {displayData && (
          <div className="flex flex-col justify-around h-full">
            <div className="flex flex-col justify-center items-center gap-3 mb-3">
              <Image src={displayData.profile_url || '/puppizen-image.png'} width={100} height={100} alt="user photo" className="my-border-gray rounded-full"/>
              <p className="text-center">{displayData.username}</p>
            </div>
            <div className="flex flex-col justify-around gap-3">
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>$PUPPIZEN</span> <span>{displayData.balance}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS</span> <span>{displayData.starsBalance}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS spent</span> <span>{displayData.totalStarsPaid}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>Referrals</span> <span>{displayData.referrals}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>Task Completed</span> <span>{displayData.taskCompleted}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <p className="flex justify-between items-center"><span>Ads Watched</span> <span>{displayData.totalAdsWatched}</span></p>
              </div>
              <div className="my-border-gray px-3 py-4 rounded-md">
                <div className="flex justify-between items-center"><span>Airdrop</span> <div className="animate-spin w-10 h-10 rounded-full border-4 my-border-gray border-t-transparent"></div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState, useEffect } from "react";
// import Image from "next/image";

// type UserData = {
//   userId: number,
//   username: string,
//   profile_url: string,
//   balance: number,
//   starsBalance: number,
//   totalStarsPaid: number,
//   totalAdsWatched: number,
//   taskCompleted: number,
//   referrals: number
// }

// export default function UserProfile() {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   // const [cachedData, setCachedData] = useState<UserData | null>(null);
//   // const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

//     // setLoading(true);
//     // setCachedData(null);

//     // const cacheKey = `cachedData-${tgUser.id}`

//     // const cached = localStorage.getItem(cacheKey);
//     // if (cached) {
//     //   try {
//     //     const parsed = JSON.parse(cached);
//     //     setCachedData(parsed);
//     //   } catch (err) {
//     //     console.error('Failed to parse cached data', err);
//     //   }
//     // }

//     if(tgUser) {
//       fetch(`/api/userdata?userId=${tgUser.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setUserData(data);
//         // localStorage.setItem(cacheKey, JSON.stringify(data));
//         // setLoading(false);
//       })
//     }
//   }, []);

//   // const displayData = loading ? cachedData : userData
  
//   return (
//     <div className="flex flex-col justify-around">
//       <h3 className="my-text-gray font-bold text-2xl text-center">My Profile</h3>
//       <div>
//         {userData ? (
//           <div className="flex flex-col justify-around">
//             <div>
//               <Image src={userData.profile_url || '/puppizen-image.png'} width={50} height={50} alt="user photo" className="my-border-gray"/>
//               <p className="text-center mt-5">{userData.username}</p>
//             </div>
//             <div className="flex flex-col justify-around">
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>$PUPPIZEN</span> <span>{userData.balance}</span></p>
//               </div>
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>$STARS</span> <span>{userData.starsBalance}</span></p>
//               </div>
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>$STARS spent</span> <span>{userData.totalStarsPaid}</span></p>
//               </div>
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>Referrals</span> <span>{userData.referrals}</span></p>
//               </div>
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>Task Completed</span> <span>{userData.taskCompleted}</span></p>
//               </div>
//               <div className="my-bg-gray my-border-white p-3 rounded-md">
//                 <p className="flex justify-between items-center"><span>Ads Watched</span> <span>{userData.totalAdsWatched}</span></p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center">No data</p>
//         )}
//       </div>
//     </div>
//   )
// }