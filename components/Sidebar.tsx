'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  Newspaper,
  Calendar,
  Wallet,
  Search,
  Bell,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Markets', href: '/markets', icon: TrendingUp },
  { name: 'Arbitrage', href: '/arbitrage', icon: Scale },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
]

const bottomNavigation = [
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-terminal-card border-r border-terminal-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-terminal-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Prediction</h1>
            <p className="text-xs text-terminal-muted terminal-text">TERMINAL</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-terminal-accent/10 text-terminal-accent'
                      : 'text-gray-400 hover:text-white hover:bg-terminal-border'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-terminal-accent live-indicator" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-terminal-border">
        <ul className="space-y-1">
          {bottomNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-terminal-border transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile */}
        <div className="mt-4 pt-4 border-t border-terminal-border">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold">
              PT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Prediction Terminal</p>
              <p className="text-xs text-terminal-muted">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
