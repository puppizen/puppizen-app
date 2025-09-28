'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: '/home.svg' },
    { href: '/tasks', label: 'Earn', icon: '/earn.svg' },
    { href: '/presale', label: 'Presale', icon: '/presale.svg' },
    { href: '/airdrop', label: 'Drop', icon: '/airdrop.svg' },
    { href: '/referral', label: 'Frens', icon: '/referral.svg' },
  ]

  return (
    <div className="fixed bottom-0 right-0 left-0 px-2">
      <div className="flex justify-around p-3 my-bg-dark">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href
          const isTaskLink = href === '/tasks'
          return (
            <Link
              key={label}
              href={href}
              className={`relative basis-1/5 flex flex-col items-center justify-center text-center py-1.5 ${
                isActive ? 'my-bg-blue scale-105 rounded-md' : 'bg-transparent'
              } transition-all duration-200 ease-in-out`}
            >
              <Image src={icon} width={20} height={20} alt={label} />
              <span className="my-text-white text-xs font-light tracking-wider">{label}</span>

              {isTaskLink && (
                <div className="absolute left-0 top-1">
                  <span className="relative flex items-center justify-center size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex size-2.5 rounded-full bg-red-500"></span>
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
