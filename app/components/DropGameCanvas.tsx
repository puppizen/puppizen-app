"use client";
import { useEffect, useState } from "react";
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
}

export default function DropGameCanvas() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

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

    if (type === "reward") setScore((s) => s + 1);
    if (type === "reward2") setScore((s) => s + 1);
    if (type === "reward3") setScore((s) => s + 1)
    if (type === "bomb") setScore((s) => Math.max(0, s - 2));
    if (type === "freeze") {
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

  function getEndMessage(score: number): {head: string, text: string} {
    if (score < 20) return {head: "Keep going!", text: "Practice makes perfect."};
    if (score >= 20 && score <= 35) return {head: "Nice catch streak!", text: "You are building mommentum."};
    if (score > 35 && score <= 60) return {head: "You’re on fire!", text: "Great reflexes shown."};
    return {head: "You nailed it!", text: "Master of the drops."};
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
        
      <div className="absolute w-full top-0 left-0 flex flex-col gap-3 p-4 z-10">
        <div className="flex justify-between items-center w-full">
          <h1>Catch the drops</h1>
          <div>
            <Link href="/" className="my-bg-gray rounded-full px-4 py-1 mb-3 btn-blue4-active btn-translate-active">
            Back
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center bg-black backdrop-blur-sm rounded-md p-3 w-full">
          <span>00:{String(timeLeft).padStart(2, '0')}s</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="absolute -top-15 left-0 w-full h-full">
        {drops.map((drop) => (
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
      ))}
      </div>
      

      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-black backdrop-blur-sm rounded-md">
          <div className="text-center">
            <p className="font-light">Your Score</p>
            <p className="text-6xl font-bold mt-2">{score}</p>
            <p className="text-lg font-bold mt-5">{getEndMessage(score).head}</p>
            <p className="font-[200] text-sm my-text-gray mt-1">{getEndMessage(score).text}</p>
          </div>
          
        </div>
      )}
      <p className="absolute bottom-0 left-0 z-10 px-4">This game is still under development. All points earned will not be calculated</p>
    </div>
  );
}
