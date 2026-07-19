'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { getUserPositions, UserPosition } from '@/lib/api'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  Search,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function PortfolioPage() {
  const [address, setAddress] = useState('')
  const [positions, setPositions] = useState<UserPosition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function fetchPortfolio(e: React.FormEvent) {
    e.preventDefault()
    if (!address.trim()) return

    try {
      setLoading(true)
      setError(null)
      const data = await getUserPositions(address.trim())
      setPositions(data)
      setHasSearched(true)
    } catch (err) {
      setError('Failed to fetch portfolio. Please check the address and try again.')
      setPositions([])
    } finally {
      setLoading(false)
    }
  }

  const portfolioValue = positions.reduce((acc, pos) => acc + pos.value, 0)
  const totalPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0)
  const totalInvested = positions.reduce((acc, pos) => {
    // Cost basis = entry price * size
    const isNo = pos.outcome.toLowerCase() === 'no'
    const entryPrice = isNo ? (1 - pos.avgPrice) : pos.avgPrice
    return acc + (entryPrice * pos.size)
  }, 0)
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const isPositive = totalPnl >= 0

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
                  View your Polymarket positions by wallet address
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Address Input */}
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
            <form onSubmit={fetchPortfolio} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="text"
                  placeholder="Enter your wallet address (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg text-sm focus:outline-none focus:border-terminal-accent font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !address.trim()}
                className="px-6 py-3 bg-terminal-accent hover:bg-terminal-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Fetch Portfolio'
                )}
              </button>
            </form>
            <p className="text-xs text-terminal-muted mt-2">
              Enter your Ethereum wallet address to view your Polymarket positions
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-terminal-danger/10 border border-terminal-danger/20 rounded-xl p-4">
              <p className="text-terminal-danger">{error}</p>
            </div>
          )}

          {/* Portfolio Overview */}
          {hasSearched && !loading && positions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <p className="text-sm text-terminal-muted mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-bold">{formatCurrency(portfolioValue)}</p>
                <p className="text-xs text-terminal-muted mt-1">Across {positions.length} positions</p>
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
                <p className="text-sm text-terminal-muted mb-1">Total Invested</p>
                <p className="text-3xl font-bold">{formatCurrency(totalInvested)}</p>
                <p className="text-xs text-terminal-muted mt-1">Cost basis</p>
              </div>
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                <p className="text-sm text-terminal-muted mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-terminal-success">
                  {positions.length > 0 
                    ? Math.round((positions.filter(p => p.pnl > 0).length / positions.length) * 100) 
                    : 0}%
                </p>
                <p className="text-xs text-terminal-muted mt-1">
                  {positions.filter(p => p.pnl > 0).length} of {positions.length} positions profitable
                </p>
              </div>
            </div>
          )}

          {/* Positions Table */}
          {hasSearched && !loading && positions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-terminal-card border border-terminal-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-terminal-border">
                    <h2 className="font-semibold">Open Positions</h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-terminal-border">
                          <th className="text-left px-6 py-4 text-sm font-medium text-terminal-muted">Market</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Outcome</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Size</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Avg Price</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Current</th>
                          <th className="text-right px-6 py-4 text-sm font-medium text-terminal-muted">P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((position, idx) => {
                          const isProfit = position.pnl >= 0
                          return (
                            <tr key={idx} className="border-b border-terminal-border hover:bg-terminal-border/30 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-medium line-clamp-1 max-w-xs" title={position.question}>
                                  {position.question}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  position.outcome.toLowerCase() === 'yes'
                                    ? 'bg-terminal-success/10 text-terminal-success'
                                    : 'bg-terminal-danger/10 text-terminal-danger'
                                }`}>
                                  {position.outcome.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <p className="font-medium">{position.size.toFixed(4)}</p>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <p className="terminal-text">{formatPercentage(position.avgPrice)}</p>
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
                    {positions.slice(0, 5).map((position, idx) => {
                      const percentage = portfolioValue > 0 ? (position.value / portfolioValue) * 100 : 0
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm line-clamp-1 max-w-[150px]" title={position.question}>
                              {position.question.slice(0, 20)}...
                            </span>
                            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                position.outcome.toLowerCase() === 'yes' ? 'bg-terminal-success' : 'bg-terminal-danger'
                              }`}
                              style={{ width: `${Math.max(percentage, 1)}%` }}
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
                      <span className="font-medium">
                        {formatCurrency(positions.length > 0 ? portfolioValue / positions.length : 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Largest Position</span>
                      <span className="font-medium">
                        {formatCurrency(Math.max(...positions.map(p => p.value), 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Best Performer</span>
                      <span className="font-medium text-terminal-success">
                        +{Math.max(...positions.map(p => p.pnlPercent), 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Worst Performer</span>
                      <span className="font-medium text-terminal-danger">
                        {Math.min(...positions.map(p => p.pnlPercent), 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* View on Polymarket */}
                <a
                  href={`https://polymarket.com/portfolio/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-terminal-card border border-terminal-border rounded-xl text-sm font-medium hover:bg-terminal-border transition-colors"
                >
                  View on Polymarket
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Empty State */}
          {hasSearched && !loading && positions.length === 0 && !error && (
            <div className="text-center py-20 bg-terminal-card border border-terminal-border rounded-xl">
              <Wallet className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No positions found</h3>
              <p className="text-sm text-terminal-muted max-w-md mx-auto">
                This wallet address doesn&apos;t have any open positions on Polymarket, or the data is temporarily unavailable.
              </p>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && !loading && (
            <div className="text-center py-20 bg-terminal-card border border-terminal-border rounded-xl">
              <Wallet className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Enter your wallet address</h3>
              <p className="text-sm text-terminal-muted max-w-md mx-auto">
                Paste your Ethereum wallet address above to view your Polymarket portfolio, positions, and P&L.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
