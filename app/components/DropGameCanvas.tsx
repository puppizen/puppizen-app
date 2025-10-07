"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
            .filter((drop) => drop.y < 600)
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

  return (
    <div className="relative w-screen h-screen overflow-hidden">

    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        points="0,0 5,3 10,0 15,5 20,0 25,4 30,0 35,6 40,0 45,5 50,0 55,3 60,0 65,5 70,0 75,4 80,0 85,6 90,0 95,5 100,0"
        stroke="#00f0ff"
        strokeWidth="0.5"
        fill="none"
        className="animate-lightning"
      />
      <polyline
        points="0,100 5,97 10,100 15,95 20,100 25,96 30,100 35,94 40,100 45,95 50,100 55,97 60,100 65,95 70,100 75,96 80,100 85,94 90,100 95,95 100,100"
        stroke="#00f0ff"
        strokeWidth="0.5"
        fill="none"
        className="animate-lightning"
      />
      <polyline
        points="0,0 3,5 0,10 4,15 0,20 5,25 0,30 6,35 0,40 5,45 0,50 3,55 0,60 5,65 0,70 4,75 0,80 6,85 0,90 5,95 0,100"
        stroke="#00f0ff"
        strokeWidth="0.5"
        fill="none"
        className="animate-lightning"
      />
      <polyline
        points="100,0 97,5 100,10 96,15 100,20 95,25 100,30 94,35 100,40 95,45 100,50 97,55 100,60 95,65 100,70 96,75 100,80 94,85 100,90 95,95 100,100"
        stroke="#00f0ff"
        strokeWidth="0.5"
        fill="none"
        className="animate-lightning"
      />
    </svg>

      <p>This game is still under development. All points earned will not be calculated</p>
      <div className="absolute top-10 z-10 flex justify-between items-center">
        <span>Time: {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>

      {drops.map((drop) => (
        <Image
          key={drop.id}
          src={`/${drop.type}.png`}
          className={`absolute transition-transform duration-300 ${drop.clicked ? 'scale-125 opacity-0' : ''}`}
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

      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
          Game Over
        </div>
      )}
    </div>
  );
}