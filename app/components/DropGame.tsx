'use client'
import Link from "next/link"
import DropAnimate from "./DropAnimate"

export default function DropGame() {
  return (
    <div>
      <Link href="/dropGame">
        <div className="relative flex flex-col gap-3 p-3 text-center rounded-md overflow-hidden">
          <svg className="absolute inset-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 -z-20 pointer-events-none bg-gradient-to-b from-transparent via-lime-700 to-black opacity-20 skew-12 perspective-distant animate-pulse scale-125">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="lime" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="absolute w-full h-full -z-10 top-0 left-0">
            <DropAnimate />
          </div>

          <span className="my-bg-dark text-xs rounded-full p-3">Coming soon</span>
          <p className="text-lg font-medium">PUPPIZEN Drop</p>
          <p className="text-xs my-text-gray">Catch the Drops</p>
          
        </div>
      </Link>
      
    </div>
  )
}