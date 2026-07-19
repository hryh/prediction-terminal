'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { mockMarkets, mockNews } from '@/lib/mock-data'
import {
  Search,
  Sparkles,
  TrendingUp,
  Newspaper,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { formatPercentage, formatCurrency, timeAgo } from '@/lib/utils'
import Link from 'next/link'

const recentSearches = [
  'Trump election odds',
  'Bitcoin price prediction',
  'Fed rate cuts',
  'ETH ETF approval',
]

const trendingSearches = [
  '2024 presidential election',
  'Crypto regulations',
  'Interest rates',
  'Geopolitical conflicts',
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const filteredMarkets = query
    ? mockMarkets.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredNews = query
    ? mockNews.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.summary.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto p-8">
          {/* Search Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-accent/10 rounded-full text-terminal-accent text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Search
            </div>
            <h1 className="text-3xl font-bold mb-4">What are you looking for?</h1>
            <p className="text-terminal-muted">
              Search markets, news, or ask AI about prediction markets
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-muted" />
            <input
              type="text"
              placeholder="Ask anything... (e.g., 'Why did Trump odds change?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-terminal-card border border-terminal-border rounded-xl text-lg focus:outline-none focus:border-terminal-accent"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-terminal-muted hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {query ? (
            /* Search Results */
            <div className="space-y-8">
              {/* Markets Results */}
              {filteredMarkets.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-terminal-accent" />
                    Markets ({filteredMarkets.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredMarkets.map((market) => (
                      <Link key={market.id} href={`/markets/${market.id}`}>
                        <div className="bg-terminal-card border border-terminal-border rounded-xl p-4 card-hover">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-terminal-border rounded text-xs">
                                  {market.category}
                                </span>
                                <span className="text-xs text-terminal-muted">{market.source}</span>
                              </div>
                              <h3 className="font-medium">{market.title}</h3>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold terminal-text">
                                {formatPercentage(market.probability)}
                              </p>
                              <p className="text-sm text-terminal-muted">
                                Vol: {formatCurrency(market.volume)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* News Results */}
              {filteredNews.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-terminal-accent" />
                    News ({filteredNews.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredNews.map((news) => (
                      <div
                        key={news.id}
                        className="bg-terminal-card border border-terminal-border rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-terminal-muted">{news.source}</span>
                          <span className="text-xs text-terminal-muted">•</span>
                          <span className="text-xs text-terminal-muted">{timeAgo(news.timestamp)}</span>
                        </div>
                        <h3 className="font-medium mb-2">{news.title}</h3>
                        <p className="text-sm text-gray-400">{news.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredMarkets.length === 0 && filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-sm text-terminal-muted">Try a different search term</p>
                </div>
              )}

              {/* AI Answer */}
              {filteredMarkets.length > 0 && (
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <h2 className="font-semibold">AI Analysis</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Based on your search for &quot;{query}&quot;, here&apos;s what I found:
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      Found {filteredMarkets.length} related markets with a combined volume of{' '}
                      {formatCurrency(filteredMarkets.reduce((acc, m) => acc + m.volume, 0))}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      Average probability across these markets is{' '}
                      {formatPercentage(
                        filteredMarkets.reduce((acc, m) => acc + m.probability, 0) /
                          filteredMarkets.length
                      )}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {filteredNews.length} recent news articles may be affecting these markets
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Default State */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Searches */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-terminal-muted" />
                  <h2 className="font-semibold">Recent Searches</h2>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-terminal-border transition-colors text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-terminal-success" />
                  <h2 className="font-semibold">Trending Now</h2>
                </div>
                <div className="space-y-2">
                  {trendingSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(search)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-terminal-border transition-colors"
                    >
                      <span className="text-sm">{search}</span>
                      <ArrowRight className="w-4 h-4 text-terminal-muted" />
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="md:col-span-2 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold">Try asking AI</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Why did Trump election odds change today?',
                    'What markets are most correlated with Bitcoin?',
                    'Show me arbitrage opportunities over 5% ROI',
                    'Which markets have the highest whale activity?',
                  ].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(question)}
                      className="text-left px-4 py-3 rounded-lg bg-terminal-bg/50 hover:bg-terminal-bg transition-colors text-sm text-gray-300"
                    >
                      &quot;{question}&quot;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
