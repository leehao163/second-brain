'use client'

import { Search, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold">第二大脑</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-muted rounded-full"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 hover:bg-muted rounded-full">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
