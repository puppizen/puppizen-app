'use client'

import Link from "next/link"
import DropGameCanvas from "../components/DropGameCanvas"

export default function DropGame() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vh] h-[200vw] z-0 pointer-events-none bg-gradient-to-b from-transparent via-lime-900 to-black opacity-20">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="lime" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="flex justify-end">
        <Link href="/" className="my-bg-gray rounded-full px-4 py-1 mb-3 btn-blue4-active:active btn-translate-active:active">
            Back
        </Link>
      </div>

      <DropGameCanvas />
    </div>
  )
}