"use client"

import React from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">FITMOVE</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost">ダッシュボード</Button>
          </Link>
          <Link href="/rewards">
            <Button variant="ghost">報酬</Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost">プロフィール</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
