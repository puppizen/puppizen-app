'use client'
import Link from "next/link"
import DropAnimate from "./DropAnimate"

export default function DropGame() {
  return (
    <div className="h-50">
      <Link href="/dropGame">
        <div className="relative rounded-md overflow-hidden h-full w-full">
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

          <div className="absolute top-3/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col gap-3 text-center z-10 p-3">
            <p className="text-lg font-medium">Drops</p>
            <p className="text-xs my-text-gray">Catch the Drops</p>
            <span className="my-bg-dark text-xs rounded-full p-3">Coming soon</span>
          </div>
          
        </div>
      </Link>
      
    </div>
  )
}