'use client'

import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { WhaleActivity as WhaleActivityType } from '@/lib/mock-data'
import { formatCurrency, timeAgo, formatPercentage } from '@/lib/utils'

interface WhaleActivityProps {
  activities: WhaleActivityType[]
}

export default function WhaleActivity({ activities }: WhaleActivityProps) {
  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-terminal-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-terminal-accent" />
          Whale Activity
        </h3>
      </div>
      <div className="divide-y divide-terminal-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-terminal-border/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${activity.action === 'buy' ? 'bg-terminal-success/10' : 'bg-terminal-danger/10'}`}>
                  {activity.action === 'buy' ? (
                    <ArrowUpRight className="w-4 h-4 text-terminal-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-terminal-danger" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.action === 'buy' ? 'Bought' : 'Sold'} {formatCurrency(activity.amount)}
                  </p>
                  <p className="text-xs text-terminal-muted">{activity.address}</p>
                </div>
              </div>
              <span className="text-xs text-terminal-muted">{timeAgo(activity.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-1 mb-1">{activity.market}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-terminal-muted">Current probability:</span>
              <span className="text-xs font-medium terminal-text">{formatPercentage(activity.probability)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
