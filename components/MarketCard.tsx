'use client'

import Link from 'next/link'
import { Droplets, BarChart3 } from 'lucide-react'
import { PolymarketMarket } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface MarketCardProps {
  market: PolymarketMarket
}

export default function MarketCard({ market }: MarketCardProps) {
  // Get probability from outcome prices (Yes is typically index 0)
  const probability = market.outcomePricesNum?.[0] ?? 0.5
  
  // Determine category from tags or use 'General'
  const category = market.tags?.[0] || 'General'
  
  return (
    <Link href={`/markets/${market.id}`}>
      <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 card-hover cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <span className="px-2.5 py-1 bg-terminal-border rounded-full text-xs font-medium text-terminal-muted">
            {category}
          </span>
          <span className="px-2.5 py-1 bg-terminal-bg rounded-full text-xs font-medium text-terminal-muted">
            Polymarket
          </span>
        </div>

        <h3 className="font-semibold text-white mb-4 line-clamp-2 min-h-[48px]">
          {market.question}
        </h3>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-terminal-muted mb-1">Probability</p>
            <p className="text-3xl font-bold terminal-text">
              {formatPercentage(probability)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-terminal-border mt-auto">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-terminal-muted" />
            <div>
              <p className="text-xs text-terminal-muted">Volume</p>
              <p className="text-sm font-medium">{formatCurrency(market.volumeNum || 0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-terminal-muted" />
            <div>
              <p className="text-xs text-terminal-muted">Liquidity</p>
              <p className="text-sm font-medium">{formatCurrency(market.liquidityNum || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
