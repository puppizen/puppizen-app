"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type DropType = "quantum" | "freeze" | "bomb";

interface Drop {
  id: string;
  type: DropType;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function DropGameCanvas() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
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
      if (!gameOver) {
        for (let i = 0; i < 15; i++) createDrop("bomb");
      }
    }, 3000);

    const freezeInterval = setInterval(() => {
      if (!gameOver) {
        for (let i = 0; i < 5; i++) createDrop("freeze");
      }
    }, 5000);

    const rewardInterval = setInterval(() => {
      if (!gameOver) {
        createDrop("quantum");
      }
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(bombInterval);
      clearInterval(freezeInterval);
      clearInterval(rewardInterval);
    };
  }, [gameOver]);

  function createDrop(type: DropType) {
    const sizeOptions = {
      quantum: [40, 45, 55],
      freeze: [30, 35, 50],
      bomb: [45, 50, 55],
    };
    const size = sizeOptions[type][Math.floor(Math.random() * 3)];
    const speed = type === "bomb" ? 3 : 4 + Math.random() * 4;

    const newDrop: Drop = {
      id: crypto.randomUUID(),
      type,
      x: Math.random() * 300,
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

    if (type === "quantum") setScore((s) => s + 1);
    if (type === "bomb") setScore((s) => Math.max(0, s - 2));
    if (type === "freeze") {
      setIsFrozen(true);
      setTimeout(() => setIsFrozen(false), 3000);
    }

    setDrops((prev) => prev.filter((drop) => drop.id !== id));
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <p>This game is still under development. All points earned will not be calculated</p>
      <div className="absolute top-10 left-10 z-10 space-x-4">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      {drops.map((drop) => (
        <Image
          key={drop.id}
          src={`/${drop.type}.png`}
          className="absolute"
          alt="drop"
          style={{
            left: drop.x,
            top: drop.y,
            width: drop.size,
            height: drop.size,
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