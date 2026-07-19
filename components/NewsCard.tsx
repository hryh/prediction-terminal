'use client'

import { Newspaper, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { NewsItem } from '@/lib/mock-data'
import { timeAgo } from '@/lib/utils'

interface NewsCardProps {
  news: NewsItem
}

const impactIcons = {
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
}

const impactColors = {
  high: 'text-terminal-danger bg-terminal-danger/10',
  medium: 'text-terminal-warning bg-terminal-warning/10',
  low: 'text-terminal-accent bg-terminal-accent/10',
}

export default function NewsCard({ news }: NewsCardProps) {
  const ImpactIcon = impactIcons[news.impact]

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-xl p-4 card-hover">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${impactColors[news.impact]}`}>
          <ImpactIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-terminal-muted">{news.source}</span>
            <span className="text-xs text-terminal-muted">•</span>
            <span className="text-xs text-terminal-muted">{timeAgo(news.timestamp)}</span>
          </div>
          <h4 className="font-medium text-white mb-2 line-clamp-2">{news.title}</h4>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">{news.summary}</p>
          <div className="flex flex-wrap gap-2">
            {news.affectedMarkets.map((market, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-terminal-bg rounded text-xs text-terminal-accent"
              >
                {market}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
