"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type DropType = "reward" | "ticket" | "freeze" | "bomb";

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
  const [tickets, setTickets] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

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

    const dropInterval = setInterval(() => {
      if (!gameOver) {
        createDrop();
      }
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(dropInterval);
    };
  }, [gameOver]);

  function createDrop() {
    const types: DropType[] = ["reward", "ticket", "freeze", "bomb"];
    const type = types[Math.floor(Math.random() * types.length)];
    const sizeOptions = {
      reward: [40, 45, 55],
      ticket: [30, 35, 40],
      freeze: [30, 35, 50],
      bomb: [45, 50, 55],
    };
    const size = sizeOptions[type][Math.floor(Math.random() * 3)];
    const speed = type === "bomb" ? 1 : 2 + Math.random() * 3;

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
      setDrops((prev) =>
        prev
          .map((drop) => ({ ...drop, y: drop.y + drop.speed }))
          .filter((drop) => drop.y < 600)
      );
    }, 50);

    return () => clearInterval(animation);
  }, []);

  function handleClick(id: string, type: DropType) {
    if (gameOver) return;

    if (type === "reward") setScore((s) => s + 1);
    if (type === "ticket") setTickets((t) => t + 1);
    if (type === "bomb") setScore((s) => Math.max(0, s - 2));
    if (type === "freeze") {
      // Optional: freeze logic
    }

    setDrops((prev) => prev.filter((drop) => drop.id !== id));
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <p>This game is still under development. All points earned will not be calculated</p>
      <div className="absolute top-10 left-10 z-10">
        <span>Score: {score}</span>
        <span>Tickets: {tickets}</span>
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

      {gameOver && <div className="absolute top-50 left-50">Game Over</div>}
    </div>
  );
}