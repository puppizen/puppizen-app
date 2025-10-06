'use client'
import Link from "next/link"

export default function DropGame() {
  return (
    <div>
      <Link href="/dropGame">
        <div className="flex flex-col gap-3 p-3 text-center bg-blue-500 rounded-md">
          <span className="my-bg-dark text-xs rounded-full p-3">Coming soon</span>
          <p className="text-lg font-medium">PUPPIZEN Drop</p>
          <p className="text-xs my-text-gray">Catch the Drops</p>
        </div>
      </Link>
      
    </div>
  )
}