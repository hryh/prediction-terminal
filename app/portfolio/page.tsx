'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { mockPortfolio, mockMarkets } from '@/lib/mock-data'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Plus,
  Settings,
  Bell,
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import PriceChart from '@/components/PriceChart'
import { generateChartData } from '@/lib/mock-data'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'alerts'>('positions')
  const portfolioValue = mockPortfolio.reduce((acc, pos) => acc + pos.amount, 0)
  const totalPnl = mockPortfolio.reduce((acc, pos) => acc + pos.pnl, 0)
  const totalPnlPercent = (totalPnl / portfolioValue) * 100
  const isPositive = totalPnl >= 0
  const chartData = generateChartData(30)

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-terminal-accent" />
                  Portfolio
                </h1>
                <p className="text-sm text-terminal-muted">
                  Track your positions and performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm hover:bg-terminal-border transition-colors">
                  <Bell className="w-4 h-4" />
                  Alerts
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-terminal-accent hover:bg-terminal-accent/90 text-white rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Position
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-bold">{formatCurrency(portfolioValue)}</p>
              <p className="text-xs text-terminal-muted mt-1">Across {mockPortfolio.length} positions</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Total P&L</p>
              <div className={`text-3xl font-bold ${isPositive ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                {isPositive ? '+' : ''}{formatCurrency(totalPnl)}
              </div>
              <p className={`text-xs mt-1 ${isPositive ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                {isPositive ? '+' : ''}{totalPnlPercent.toFixed(2)}% all time
              </p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Available Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(25000)}</p>
              <p className="text-xs text-terminal-muted mt-1">Ready to deploy</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-terminal-success">67%</p>
              <p className="text-xs text-terminal-muted mt-1">4 of 6 positions profitable</p>
            </div>
          </div>

          {/* Portfolio Chart */}
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Portfolio Performance</h2>
                <p className="text-sm text-terminal-muted">Value over time</p>
              </div>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
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
            <PriceChart data={chartData} height={300} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Positions Table */}
            <div className="lg:col-span-2">
              <div className="bg-terminal-card border border-terminal-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-terminal-border">
                  <h2 className="font-semibold">Open Positions</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('positions')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeTab === 'positions'
                          ? 'bg-terminal-accent text-white'
                          : 'text-terminal-muted hover:text-white'
                      }`}
                    >
                      Positions
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeTab === 'history'
                          ? 'bg-terminal-accent text-white'
                          : 'text-terminal-muted hover:text-white'
                      }`}
                    >
                      History
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-terminal-border">
                        <th className="text-left px-6 py-4 text-sm font-medium text-terminal-muted">Market</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Position</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Amount</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Entry</th>
                        <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Current</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-terminal-muted">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPortfolio.map((position) => {
                        const isProfit = position.pnl >= 0
                        return (
                          <tr key={position.id} className="border-b border-terminal-border hover:bg-terminal-border/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium line-clamp-1 max-w-xs">{position.market}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                position.position === 'yes'
                                  ? 'bg-terminal-success/10 text-terminal-success'
                                  : 'bg-terminal-danger/10 text-terminal-danger'
                              }`}>
                                {position.position.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-medium">{formatCurrency(position.amount)}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="terminal-text">{formatPercentage(position.entryPrice)}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="terminal-text">{formatPercentage(position.currentPrice)}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className={`${isProfit ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                                <p className="font-medium">
                                  {isProfit ? '+' : ''}{formatCurrency(position.pnl)}
                                </p>
                                <p className="text-xs">
                                  {isProfit ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                                </p>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Allocation */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5" />
                  <h2 className="font-semibold">Allocation</h2>
                </div>
                <div className="space-y-4">
                  {mockPortfolio.map((position) => {
                    const percentage = (position.amount / portfolioValue) * 100
                    return (
                      <div key={position.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm line-clamp-1 max-w-[150px]">{position.market}</span>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              position.position === 'yes' ? 'bg-terminal-success' : 'bg-terminal-danger'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Avg Position Size</span>
                    <span className="font-medium">{formatCurrency(portfolioValue / mockPortfolio.length)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Largest Position</span>
                    <span className="font-medium">
                      {formatCurrency(Math.max(...mockPortfolio.map(p => p.amount)))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Best Performer</span>
                    <span className="font-medium text-terminal-success">
                      +{Math.max(...mockPortfolio.map(p => p.pnlPercent)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-terminal-muted">Worst Performer</span>
                    <span className="font-medium text-terminal-danger">
                      {Math.min(...mockPortfolio.map(p => p.pnlPercent)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Watchlist Preview */}
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Watchlist</h2>
                  <button className="text-sm text-terminal-accent hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {mockMarkets.slice(0, 3).map((market) => (
                    <div
                      key={market.id}
                      className="flex items-center justify-between p-3 bg-terminal-bg rounded-lg"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium line-clamp-1">{market.title}</p>
                        <p className="text-xs text-terminal-muted">{market.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium terminal-text">{formatPercentage(market.probability)}</p>
                        <p className={`text-xs ${market.change24h >= 0 ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                          {market.change24h >= 0 ? '+' : ''}{formatPercentage(market.change24h)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
