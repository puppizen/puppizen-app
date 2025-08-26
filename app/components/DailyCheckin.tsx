'use client'
import React, { useState } from "react"

const wheelRewards = [
  { label: "0.1", color: "#0098EA" },
  { label: "0.3", color: "#58BBF1" },
  { label: "0.2", color: "##0098EA" },
  { label: "0", color: "#2D83EC" },
  { label: "1", color: "#1AC9FF" },
];

export default function DailyCheckin () {
  const [reward, setReward] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (spinCount >= 3 || isSpinning) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * wheelRewards.length);
    const segmentAngle = 360 / wheelRewards.length;
    const targetRotation = 360 * 5 + segmentAngle * randomIndex;

    setRotation(targetRotation);

    setTimeout(() => {
      setReward(wheelRewards[randomIndex].label);
      setSpinCount(spinCount + 1);
      setIsSpinning(false);
    }, 3000);
  }

  return (
    <div className="relative w-[300px] h-[300px] mx-auto rounded-full my-border-gray p-3">
      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0 h-0 
        border-l-[15px] border-l-transparent 
        border-r-[15px] border-r-transparent 
        border-b-[20px] border-b-red-500 z-10" />
      <div className="relative w-full h-full rounded-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {wheelRewards.map((item, index) => (
          <div
            key={index}
            className="segment my-text-white"
            style={{
              transform: `rotate(${index * (360 / wheelRewards.length)}deg)`,
              backgroundColor: item.color,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <button onClick={spinWheel} disabled={isSpinning || spinCount >= 3}>
        {spinCount < 3 ? "Spin the Wheel" : "Come back tomorrow!"}
      </button>
      <div className="reward-display">{reward && `You won: ${reward}`}</div>
    </div>

  )
}