'use client'
import React, { useEffect, useState } from "react"


export default function CountDownTimer() {
    const [timeLeft, setTimeLeft] = useState({days:0, hours:0, minutes:0, seconds:0});

    useEffect(() => {
        const targetDate = new Date('2026-05-25T00:00:00');
        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateCountdown(); 
        const interval = setInterval(updateCountdown, 1000); // updates every second

        return () => clearInterval(interval);
    
    }, []);

    return (
        <div className="flex flex-row justify-center items-center gap-2 font-medium">
            <p className="font-bold">When TGE?</p>
            <span className="relative py-2 w-12 text-center my-bg-blue rounded-md">{String(timeLeft.days)}
                <span className="absolute right-1 top-1 my-text-xs font-light my-text-gray">D</span>
            </span>
            <span className="relative py-2 w-12 text-center my-bg-blue rounded-md">{String(timeLeft.hours).padStart(2, '0')}
                <span className="absolute right-1 top-1 my-text-xs font-light my-text-gray">H</span>
            </span>
            <span className="relative py-2 w-12 text-center my-bg-blue rounded-md">{String(timeLeft.minutes).padStart(2, '0')}
                <span className="absolute right-1 top-1 my-text-xs font-light my-text-gray">M</span>
            </span>
            <span className="relative py-2 w-12 text-center my-bg-blue rounded-md">{String(timeLeft.seconds).padStart(2, '0')}
                <span className="absolute right-1 top-1 my-text-xs font-light my-text-gray">S</span>
            </span>
        </div>
    )
}