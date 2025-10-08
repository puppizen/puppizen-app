'use client'

import DropGameCanvas from "../components/DropGameCanvas"

export default function DropGame() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-lime-500 to-black opacity-20">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="lime" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <DropGameCanvas />
    </div>
  )
}