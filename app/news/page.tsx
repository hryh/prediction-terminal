'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { mockNews, NewsItem } from '@/lib/mock-data'
import {
  Newspaper,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ExternalLink,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { timeAgo } from '@/lib/utils'

const impactFilters = [
  { value: 'all', label: 'All Impact', icon: Info },
  { value: 'high', label: 'High Impact', icon: AlertTriangle },
  { value: 'medium', label: 'Medium Impact', icon: AlertCircle },
  { value: 'low', label: 'Low Impact', icon: Info },
]

const sources = ['All Sources', 'Reuters', 'AP', 'CoinDesk', 'Bloomberg', 'Whale Alert']

const impactIcons = {
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
}

const impactColors = {
  high: 'text-terminal-danger bg-terminal-danger/10 border-terminal-danger/20',
  medium: 'text-terminal-warning bg-terminal-warning/10 border-terminal-warning/20',
  low: 'text-terminal-accent bg-terminal-accent/10 border-terminal-accent/20',
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImpact, setSelectedImpact] = useState('all')
  const [selectedSource, setSelectedSource] = useState('All Sources')

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesImpact = selectedImpact === 'all' || news.impact === selectedImpact
    const matchesSource = selectedSource === 'All Sources' || news.source === selectedSource
    return matchesSearch && matchesImpact && matchesSource
  })

  const highImpactCount = mockNews.filter((n) => n.impact === 'high').length
  const mediumImpactCount = mockNews.filter((n) => n.impact === 'medium').length

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-terminal-accent" />
                  AI News Intelligence
                </h1>
                <p className="text-sm text-terminal-muted">
                  AI-analyzed news with market impact assessment
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-terminal-success live-indicator" />
                  <span className="text-sm">Live Feed</span>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm focus:outline-none focus:border-terminal-accent"
                />
              </div>
              
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm focus:outline-none focus:border-terminal-accent"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-accent/10 rounded-lg">
                  <Newspaper className="w-5 h-5 text-terminal-accent" />
                </div>
                <span className="text-sm text-terminal-muted">Total Articles</span>
              </div>
              <p className="text-3xl font-bold">{mockNews.length}</p>
              <p className="text-xs text-terminal-muted mt-1">Last 24 hours</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-danger/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-terminal-danger" />
                </div>
                <span className="text-sm text-terminal-muted">High Impact</span>
              </div>
              <p className="text-3xl font-bold text-terminal-danger">{highImpactCount}</p>
              <p className="text-xs text-terminal-muted mt-1">Require attention</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-warning/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-terminal-warning" />
                </div>
                <span className="text-sm text-terminal-muted">Medium Impact</span>
              </div>
              <p className="text-3xl font-bold text-terminal-warning">{mediumImpactCount}</p>
              <p className="text-xs text-terminal-muted mt-1">Worth monitoring</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-terminal-muted">AI Analysis</span>
              </div>
              <p className="text-3xl font-bold">100%</p>
              <p className="text-xs text-terminal-muted mt-1">Articles processed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5" />
                  <h2 className="font-semibold">Impact Filter</h2>
                </div>

                <div className="space-y-2">
                  {impactFilters.map((filter) => {
                    const Icon = filter.icon
                    return (
                      <button
                        key={filter.value}
                        onClick={() => setSelectedImpact(filter.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedImpact === filter.value
                            ? 'bg-terminal-accent text-white'
                            : 'hover:bg-terminal-border text-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{filter.label}</span>
                        {filter.value !== 'all' && (
                          <span className="ml-auto text-xs">
                            {mockNews.filter((n) => n.impact === filter.value).length}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-terminal-border">
                  <h3 className="text-sm font-medium text-terminal-muted mb-4">AI Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span>Automatic market tagging</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-terminal-success mt-0.5" />
                      <span>Impact scoring</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Clock className="w-4 h-4 text-terminal-accent mt-0.5" />
                      <span>Real-time alerts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredNews.length > 0 ? (
                  filteredNews.map((news) => {
                    const ImpactIcon = impactIcons[news.impact]
                    return (
                      <div
                        key={news.id}
                        className="bg-terminal-card border border-terminal-border rounded-xl p-6 card-hover"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${impactColors[news.impact]}`}>
                            <ImpactIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-terminal-bg rounded text-xs font-medium">
                                {news.source}
                              </span>
                              <span className="text-xs text-terminal-muted">
                                {timeAgo(news.timestamp)}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[news.impact]}`}>
                                {news.impact.toUpperCase()} IMPACT
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
                            <p className="text-gray-400 mb-4">{news.summary}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                {news.affectedMarkets.map((market, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-terminal-bg rounded-lg text-sm text-terminal-accent border border-terminal-border"
                                  >
                                    {market}
                                  </span>
                                ))}
                              </div>
                              <button className="flex items-center gap-1 text-sm text-terminal-accent hover:underline">
                                Read more <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-20">
                    <Newspaper className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No news found</h3>
                    <p className="text-sm text-terminal-muted">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
