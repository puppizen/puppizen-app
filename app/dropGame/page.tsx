'use client'

import DropGameCanvas from "../components/DropGameCanvas"

export default function DropGame() {
  return (
    <div className="relative h-screen">
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-gradient-to-b from-transparent via-lime-500 to-black opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="lime" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <DropGameCanvas />
    </div>
  )
}