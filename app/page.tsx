'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketCard from '@/components/MarketCard'
import NewsCard from '@/components/NewsCard'
import WhaleActivity from '@/components/WhaleActivity'
import {
  getTrendingMarkets,
  getEndingSoonMarkets,
  PolymarketMarket,
} from '@/lib/api'
import {
  mockNews,
  mockWhaleActivity,
} from '@/lib/mock-data'
import {
  TrendingUp,
  Zap,
  Search,
  Bell,
  ArrowRight,
  Sparkles,
  Activity,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const [trendingMarkets, setTrendingMarkets] = useState<PolymarketMarket[]>([])
  const [endingSoonMarkets, setEndingSoonMarkets] = useState<PolymarketMarket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const latestNews = mockNews.slice(0, 3)

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const [trending, endingSoon] = await Promise.all([
        getTrendingMarkets(12),
        getEndingSoonMarkets(12),
      ])
      setTrendingMarkets(trending)
      setEndingSoonMarkets(endingSoon)
    } catch (err) {
      console.error('Error fetching data:', err)
      setTrendingMarkets([])
      setEndingSoonMarkets([])
      setError('Failed to fetch live Polymarket markets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const allLoadedMarkets = [...trendingMarkets, ...endingSoonMarkets]
  const uniqueLoadedMarkets = Array.from(new Map(allLoadedMarkets.map((market) => [market.id, market])).values())
  const totalVolume = uniqueLoadedMarkets.reduce((acc, m) => acc + (m.volumeNum || 0), 0)
  const totalLiquidity = uniqueLoadedMarkets.reduce((acc, m) => acc + (m.liquidityNum || 0), 0)
  const activeMarkets = uniqueLoadedMarkets.filter((market) => market.active && !market.closed).length
  const acceptingOrders = uniqueLoadedMarkets.filter((market) => market.acceptingOrders).length

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-terminal-muted">Welcome back to Prediction Terminal</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  className="pl-10 pr-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm focus:outline-none focus:border-terminal-accent w-64"
                />
              </div>
              <button className="p-2 bg-terminal-card border border-terminal-border rounded-lg hover:bg-terminal-border transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-terminal-danger rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-terminal-accent" />
              <span className="ml-3 text-terminal-muted">Loading markets...</span>
            </div>
          ) : error ? (
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-8 text-center">
              <AlertCircle className="w-10 h-10 text-terminal-warning mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Live markets unavailable</h2>
              <p className="text-sm text-terminal-muted mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-terminal-accent hover:bg-terminal-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-terminal-accent/10 rounded-lg">
                      <Activity className="w-5 h-5 text-terminal-accent" />
                    </div>
                    <span className="text-sm text-terminal-muted">Loaded Volume</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(totalVolume)}</p>
                  <p className="text-xs text-terminal-success mt-1">From live Polymarket rows</p>
                </div>
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-terminal-success/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-terminal-success" />
                    </div>
                    <span className="text-sm text-terminal-muted">Active Markets</span>
                  </div>
                  <p className="text-2xl font-bold">{activeMarkets}</p>
                  <p className="text-xs text-terminal-success mt-1">Loaded active markets</p>
                </div>
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-terminal-warning/10 rounded-lg">
                      <Zap className="w-5 h-5 text-terminal-warning" />
                    </div>
                    <span className="text-sm text-terminal-muted">Accepting Orders</span>
                  </div>
                  <p className="text-2xl font-bold">{acceptingOrders}</p>
                  <p className="text-xs text-terminal-muted mt-1">No synthetic arbitrage</p>
                </div>
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-sm text-terminal-muted">Loaded Liquidity</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(totalLiquidity)}</p>
                  <p className="text-xs text-terminal-success mt-1">From live Polymarket rows</p>
                </div>
              </div>

              {/* Trending Markets */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">Trending Markets</h2>
                    <p className="text-sm text-terminal-muted">Highest volume on Polymarket</p>
                  </div>
                  <a href="/markets" className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                    View all <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingMarkets.slice(0, 6).map((market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Arbitrage Opportunities */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold">Arbitrage Opportunities</h2>
                      <p className="text-sm text-terminal-muted">Cross-platform price differences</p>
                    </div>
                    <a href="/arbitrage" className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                      View all <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-terminal-warning mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-2">No verified arbitrage feed connected</h3>
                          <p className="text-sm text-terminal-muted">
                            Arbitrage requires comparable prices from at least two live venues. This build only has Polymarket market data, so fabricated opportunities are hidden.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Whale Activity */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold">Whale Activity</h2>
                      <p className="text-sm text-terminal-muted">Large position movements</p>
                    </div>
                    <a href="/markets" className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                      View all <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                  <WhaleActivity activities={mockWhaleActivity} />
                </div>
              </div>

              {/* AI News Intelligence */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI News Intelligence
                    </h2>
                    <p className="text-sm text-terminal-muted">AI-analyzed news with market impact</p>
                  </div>
                  <a href="/news" className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                    View all <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              </div>

              {/* Ending Soon */}
              {endingSoonMarkets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold">Ending Soon</h2>
                      <p className="text-sm text-terminal-muted">Markets closing soon</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {endingSoonMarkets.slice(0, 3).map((market) => (
                      <MarketCard key={market.id} market={market} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
