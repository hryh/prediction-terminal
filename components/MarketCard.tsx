'use client'

import Link from 'next/link'
import { TrendingUp, TrendingDown, Droplets, BarChart3 } from 'lucide-react'
import { Market } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'

interface MarketCardProps {
  market: Market
}

export default function MarketCard({ market }: MarketCardProps) {
  const isPositive = market.change24h >= 0

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 card-hover cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <span className="px-2.5 py-1 bg-terminal-border rounded-full text-xs font-medium text-terminal-muted">
            {market.category}
          </span>
          <span className="px-2.5 py-1 bg-terminal-bg rounded-full text-xs font-medium text-terminal-muted">
            {market.source}
          </span>
        </div>

        <h3 className="font-semibold text-white mb-4 line-clamp-2 min-h-[48px]">
          {market.title}
        </h3>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-terminal-muted mb-1">Probability</p>
            <p className="text-3xl font-bold terminal-text">
              {formatPercentage(market.probability)}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-terminal-success' : 'text-terminal-danger'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{formatPercentage(market.change24h)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-terminal-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-terminal-muted" />
            <div>
              <p className="text-xs text-terminal-muted">Volume</p>
              <p className="text-sm font-medium">{formatCurrency(market.volume)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-terminal-muted" />
            <div>
              <p className="text-xs text-terminal-muted">Liquidity</p>
              <p className="text-sm font-medium">{formatCurrency(market.liquidity)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
