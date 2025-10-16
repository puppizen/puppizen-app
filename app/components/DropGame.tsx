'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import DropAnimate from "./DropAnimate"
import Image from "next/image"

export default function DropGame() {
  const [gameTicket, setGameTicket] = useState<number | null>(null);
  const [cachedTickets, setCachedTickets] = useState<number | null>(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    const cacheKey = `cachedTickets-${tgUser.id}`
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setCachedTickets(Number(cached));
      } catch (err) {
        console.error('Failed to parse cached tickets:', err);
      }
    }
    if (tgUser.id) {
      fetch(`/api/balance?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGameTicket(data.gameTicket);
        localStorage.removeItem(cacheKey);
        localStorage.setItem(cacheKey, data.gameTicket.toString());
      })
    }
  }, [])

  const userGameTicket = cachedTickets || gameTicket;

  return (
    <div className="h-50">
      <Link href="/dropGame">
        <div className="relative rounded-md overflow-hidden h-full w-full">
          <svg className="absolute inset-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 -z-20 pointer-events-none bg-gradient-to-b from-transparent via-lime-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="lime" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="absolute w-full h-full -z-10 top-0 left-0">
            <DropAnimate />
          </div>

          <div className="absolute top-5 right-5 flex items-center gap-1 py-1 px-2 rotate-10 bg-black rounded-full">
            <p className="text-white/85 font-light text-xs">{userGameTicket}</p>
            <Image className="-rotate-35" src="/tickets.svg" width={12} height={12} alt="tickets"/>
          </div>

          <div className="absolute top-3/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col gap-3 text-center p-3">
            <p className="text-lg font-medium">Drops</p>
            <p className="text-xs my-text-gray">Catch the Drops</p>
            <span className="bg-gray-500/35 text-xs rounded-full p-3 w-full">Start Playing</span>
          </div>
          
        </div>
      </Link>
      
    </div>
  )
}