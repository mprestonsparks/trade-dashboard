'use client'

import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M2 2v20h20" />
            <path d="M6 16l6-8 6 8" />
          </svg>
          <h1 className="text-xl font-semibold">Trading Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
