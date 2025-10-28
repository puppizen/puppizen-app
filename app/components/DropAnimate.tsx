"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type DropType = "reward2" | "bomb";

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

  // Create a new drop of the given type
  function createDrop(type: DropType) {
    const sizeOptions = {
      reward2: [10, 15, 25],
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

    setDrops((prev) => {
      const updated = [...prev, newDrop];
      return updated.length > 30 ? updated.slice(-30) : updated;
    });
  }

  // Animate drops falling
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

  // Continuously generate new drops
  useEffect(() => {
    const dropInterval = setInterval(() => {
      const randomType: DropType = Math.random() > 0.5 ? "reward2" : "bomb";
      createDrop(randomType);
    }, 500); // Adjust frequency as needed

    return () => clearInterval(dropInterval);
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