"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type DropType = "reward" | "bomb";

interface Drop {
  id: string;
  type: DropType;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function DropAnimate() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    createDrop("reward");
    createDrop("bomb");
  }, []);

  function createDrop(type: DropType) {
    const sizeOptions = {
      reward: [10, 15, 25],
      bomb: [10, 15, 20],
    };
    const size = sizeOptions[type][Math.floor(Math.random() * sizeOptions[type].length)];
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
      setDrops((prev) =>
        prev
          .map((drop) => ({ ...drop, y: drop.y + drop.speed }))
          .filter((drop) => drop.y < 300)
      );
    }, 30);

    return () => clearInterval(animation);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        {drops.map((drop) => (
          <Image
            key={drop.id}
            src={`/${drop.type}.png`}
            className="absolute"
            alt="drop"
            style={{
              left: drop.x,
              top: drop.y,
              width: drop.size + 10,
              height: drop.size + 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}