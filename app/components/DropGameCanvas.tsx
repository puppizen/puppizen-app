"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type DropType = "reward" | "reward2" | "reward3" | "freeze" | "bomb";

interface Drop {
  id: string;
  type: DropType;
  x: number;
  y: number;
  size: number;
  speed: number;
  clicked?: boolean;
  showScore?: boolean;
}

export default function DropGameCanvas() {
  const [userId, setUserId] = useState<number | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [gameBooster, setGameBooster] = useState<number | null>(null);
  const [bombClicked, setBombClicked] = useState(false);
  const [claimButton, setClaimButton] = useState(false);
  const [resetButton, setResetButton] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (tgUser.id) {
      setUserId(tgUser.id)

      fetch(`/api/balance?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGameBooster(data.gameBooster)
      })
    }
  }, [])

  useEffect(() => {
    let bombCount = 0;
    let freezeCount = 0;
    let rewardCount = 0;
    let reward2Count = 0;
    let reward3Count = 0;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const bombInterval = setInterval(() => {
      if (!gameOver && bombCount < 15) {
        createDrop("bomb");
        bombCount++;
      }
    }, 3000);

    const freezeInterval = setInterval(() => {
      if (!gameOver && freezeCount < 5) {
        createDrop("freeze");
        freezeCount++;
      }
    }, 5000);

    const rewardInterval = setInterval(() => {
      if (!gameOver && rewardCount < 50) {
        createDrop("reward");
        rewardCount++
      }
    }, 1000);

    const reward2Interval = setInterval(() => {
      if (!gameOver && reward2Count < 50) {
        createDrop("reward");
        reward2Count++
      }
    }, 1000);

    const reward3Interval = setInterval(() => {
      if (!gameOver && reward3Count < 50) {
        createDrop("reward");
        reward3Count++
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(bombInterval);
      clearInterval(freezeInterval);
      clearInterval(rewardInterval);
      clearInterval(reward2Interval);
      clearInterval(reward3Interval);
    };
  }, [gameOver]);

  function createDrop(type: DropType) {
    const sizeOptions = {
      reward: [40, 45, 55],
      reward2: [45, 55, 60],
      reward3: [40, 55, 60],
      freeze: [30, 35, 50],
      bomb: [45, 50, 55],
    };
    const size = sizeOptions[type][Math.floor(Math.random() * 3)];
    const speed = type === "bomb" ? 3 : 4 + Math.random() * 4;

    const screenWidth = window.innerWidth

    const newDrop: Drop = {
      id: crypto.randomUUID(),
      type,
      x: Math.random() * (screenWidth - size),
      y: 0,
      size,
      speed,
    };

    setDrops((prev) => [...prev, newDrop]);
  }

  useEffect(() => {
    const animation = setInterval(() => {
      if (!isFrozen) {
        setDrops((prev) =>
          prev
            .map((drop) => ({ ...drop, y: drop.y + drop.speed }))
            .filter((drop) => drop.y < window.innerHeight)
        );
      }
    }, 30); // faster movement

    return () => clearInterval(animation);
  }, [isFrozen]);

  function handleClick(id: string, type: DropType) {
    if (gameOver) return;
    const addScore = (gameBooster ?? 1) * 1;
    const claimSound = new Audio("/claim.mp3");
    const freezeSound = new Audio("/freeze.mp3");
    const bombSound = new Audio("/bomb.mp3");

    if (type === "reward" || type === "reward2" || type === "reward3") {
      claimSound.play();
      setScore((s) => s + addScore);

      setDrops((prev) =>
        prev.map((drop) =>
          drop.id === id ? { ...drop, clicked: true, showScore: true } : drop
        )
      );

      setTimeout(() => {
        setDrops((prev) => prev.map((drop) => drop.id === id ? { ...drop, showScore: false } : drop));
      }, 300);
    }
    if (type === "bomb") {
      bombSound.play();
      setScore((s) => Math.max(0, s - 2))
      setBombClicked(true)
      setTimeout(() => setBombClicked(false), 1000);
    };
    if (type === "freeze") {
      freezeSound.play();
      setIsFrozen(true);
      setTimeout(() => setIsFrozen(false), 3000);
    }

    setDrops((prev) =>
      prev.map((drop) =>
        drop.id === id ? { ...drop, clicked: true } : drop
      )
    );

    setTimeout(() => {
      setDrops((prev) => prev.filter((drop) => drop.id !== id));
    }, 300);
  }

  function renderBackgroundSVG() {
    if (gameOver) {
      return (
        <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-amber-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="yellow" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      );
    }

    if (bombClicked) {
      return (
        <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-red-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="red" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      );
    }

    if (isFrozen) {
      return (
        <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-sky-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      );
    }

    return (
      <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-lime-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="lime" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    ) 
  }

  function getEndMessage(score: number): {head: string, text: string} {
    if (score < 20) return {head: "Keep going!", text: "Practice makes perfect."};
    if (score >= 20 && score <= 35) return {head: "Nice catch streak!", text: "You are building mommentum."};
    if (score > 35 && score <= 60) return {head: "You’re on fire!", text: "Great reflexes shown."};
    return {head: "You nailed it!", text: "Master of the drops."};
  }

  const handleClaimReward = async () => {
    setClaimButton(true);
    setTimeout(() => setClaimButton(false), 300)
    const rewardSound = new Audio("/reward.mp3");
    const res = await fetch("/api/gameReward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, score }),
    })

    rewardSound.play();

    if (res.ok) {
      setRewardClaimed(true)
      console.log("rewardClaimed");
    }
  }

  function handleRestartGame() {
    setResetButton(true);
    setTimeout(() => setResetButton(false), 300)

    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setDrops([]);
    setIsFrozen(false);
    setRewardClaimed(false);
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {renderBackgroundSVG()}
        
      <div className="absolute w-full top-0 left-0 flex flex-col gap-3 p-4 z-10">
        <div className="flex justify-between items-center w-full">
          <h1>Catch the drops</h1>
          <div>
            <Link href="/" className="my-bg-gray rounded-full px-4 py-1 mb-3 btn-blue4-active btn-translate-active">
            Back
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center bg-black/40 backdrop-blur-md rounded-md p-3 w-full">
          <span>00:{String(timeLeft).padStart(2, '0')}s</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="absolute -top-15 left-0 w-full h-full">
        {drops.map((drop) => (
          <React.Fragment key={drop.id}>
            <Image
              key={drop.id}
              src={`/${drop.type}.png`}
              className={`absolute transition-transform duration-300  ${drop.clicked ? 'scale-125 opacity-0' : ''}`}
              alt="drop"
              style={{
                left: drop.x,
                top: drop.y,
                width: drop.size + 10,
                height: drop.size + 10,
              }}
              onClick={() => handleClick(drop.id, drop.type)}
            />

            {drop.showScore && (
              <div
                className="absolute text-amber font-thin text-xs animate-bounce"
                style={{
                  left: drop.x + drop.size / 2,
                  top: drop.y - 20,
                }}
              >
                + {gameBooster ?? 1}
              </div>
            )}

          </React.Fragment>
        ))}
      </div>
      

      {gameOver && (
        <div className="absolute top-3/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 flex flex-col gap-3">
          <div className="text-center p-3 bg-black/30 backdrop-blur-md rounded-md w-full">
            <p className="font-thin text-amber-400/40">Your Score</p>
            <p className="text-6xl font-bold mt-2 text-amber-400">{score}</p>
            <p className="text-lg font-bold mt-5">{getEndMessage(score).head}</p>
            <p className="font-light text-sm my-text-gray mt-1">{getEndMessage(score).text}</p>
          </div> 
          <div className="w-full flex flex-col gap-2">
            <button onClick={rewardClaimed === true ? undefined : handleClaimReward} className={`bg-amber-400 text-black py-2 text-lg rounded-full w-full outline-0 transition delay-150 duration-300 ease-in-out ${claimButton ? "-translate-y-1 scale-75" : ""}`}>Claim</button>  

            <button onClick={rewardClaimed !== true ? undefined : handleRestartGame} className={`w-full py-2 bg-black text-amber-400 rounded-full outline-0 text-lg transition delay-150 duration-300 ease-in-out ${resetButton ? "-translate-y-1 scale-75" : ""}`}>Play again</button>
          </div>      
        </div>
      )}
      <p className="absolute bottom-0 left-0 z-10 px-4">This game is still under development. All points earned will not be calculated</p>
    </div>
  );
}