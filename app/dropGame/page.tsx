'use client'

import DropGameCanvas from "../components/DropGameCanvas"

export default function DropGame() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-lime-700 to-black opacity-30 skew-12 perspective-origin-center">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="lime" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <DropGameCanvas />
    </div>
  )
}