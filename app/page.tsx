'use client'

import Sidebar from '@/components/Sidebar'
import MarketCard from '@/components/MarketCard'
import NewsCard from '@/components/NewsCard'
import ArbitrageCard from '@/components/ArbitrageCard'
import WhaleActivity from '@/components/WhaleActivity'
import PriceChart from '@/components/PriceChart'
import {
  mockMarkets,
  mockNews,
  mockArbitrage,
  mockWhaleActivity,
  generateChartData,
} from '@/lib/mock-data'
import {
  TrendingUp,
  Zap,
  Search,
  Bell,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function Dashboard() {
  const trendingMarkets = mockMarkets.slice(0, 3)
  const latestNews = mockNews.slice(0, 3)
  const arbitrageOpportunities = mockArbitrage.slice(0, 2)
  const chartData = generateChartData(30)

  // Calculate total volume
  const totalVolume = mockMarkets.reduce((acc, m) => acc + m.volume, 0)

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
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-accent/10 rounded-lg">
                  <Activity className="w-5 h-5 text-terminal-accent" />
                </div>
                <span className="text-sm text-terminal-muted">Total Volume</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(totalVolume)}</p>
              <p className="text-xs text-terminal-success mt-1">+12.5% from last week</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-success/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-terminal-success" />
                </div>
                <span className="text-sm text-terminal-muted">Active Markets</span>
              </div>
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-xs text-terminal-success mt-1">+156 new today</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-terminal-warning/10 rounded-lg">
                  <Zap className="w-5 h-5 text-terminal-warning" />
                </div>
                <span className="text-sm text-terminal-muted">Arb Opportunities</span>
              </div>
              <p className="text-2xl font-bold">{mockArbitrage.length}</p>
              <p className="text-xs text-terminal-muted mt-1">Avg ROI: 7.1%</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-terminal-muted">AI Signals</span>
              </div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-terminal-success mt-1">8 high confidence</p>
            </div>
          </div>

          {/* Market Overview Chart */}
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Market Overview</h2>
                <p className="text-sm text-terminal-muted">30-day probability trends</p>
              </div>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      period === '1M'
                        ? 'bg-terminal-accent text-white'
                        : 'bg-terminal-bg text-terminal-muted hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <PriceChart data={chartData} height={250} />
          </div>

          {/* Trending Markets */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Trending Markets</h2>
                <p className="text-sm text-terminal-muted">Most active markets by volume</p>
              </div>
              <button className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingMarkets.map((market) => (
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
                <button className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {arbitrageOpportunities.map((opp) => (
                  <ArbitrageCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </div>

            {/* Whale Activity */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Whale Activity</h2>
                  <p className="text-sm text-terminal-muted">Large position movements</p>
                </div>
                <button className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                  View all <ArrowRight className="w-4 h-4" />
                </button>
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
              <button className="flex items-center gap-2 text-sm text-terminal-accent hover:underline">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
