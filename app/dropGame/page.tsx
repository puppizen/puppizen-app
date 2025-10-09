'use client'

import DropGameCanvas from "../components/DropGameCanvas"

export default function DropGame() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <DropGameCanvas />
    </div>
  )
}