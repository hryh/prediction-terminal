'use client'

import { ArrowRight, TrendingUp, Clock, Shield } from 'lucide-react'
import { ArbitrageOpportunity } from '@/lib/mock-data'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface ArbitrageCardProps {
  opportunity: ArbitrageOpportunity
}

export default function ArbitrageCard({ opportunity }: ArbitrageCardProps) {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 bg-terminal-success/10 text-terminal-success rounded-full text-xs font-medium">
          +{opportunity.roi.toFixed(1)}% ROI
        </span>
        <div className="flex items-center gap-1 text-terminal-muted">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{opportunity.executionTime}</span>
        </div>
      </div>

      <h4 className="font-medium text-white mb-4 line-clamp-2">{opportunity.market}</h4>

      <div className="flex items-center justify-between bg-terminal-bg rounded-lg p-3 mb-4">
        <div className="text-center">
          <p className="text-xs text-terminal-muted mb-1">{opportunity.platformA}</p>
          <p className="text-lg font-bold terminal-text">{formatPercentage(opportunity.priceA)}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-terminal-muted" />
        <div className="text-center">
          <p className="text-xs text-terminal-muted mb-1">{opportunity.platformB}</p>
          <p className="text-lg font-bold terminal-text">{formatPercentage(opportunity.priceB)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-terminal-border">
        <div>
          <p className="text-xs text-terminal-muted mb-1">Available Liquidity</p>
          <p className="text-sm font-medium">{formatCurrency(opportunity.liquidity)}</p>
        </div>
        <div>
          <p className="text-xs text-terminal-muted mb-1">Confidence Score</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-terminal-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-terminal-success rounded-full"
                style={{ width: `${opportunity.confidence * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">{(opportunity.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
