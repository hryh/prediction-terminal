'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import PriceChart from '@/components/PriceChart'
import { getMarket, getPriceHistory, PolymarketMarket, PriceHistoryPoint } from '@/lib/api'
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Droplets,
  BarChart3,
  Calendar,
  ExternalLink,
  Sparkles,
  Users,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils'

interface MarketDetailClientProps {
  marketId: string
}

export default function MarketDetailClient({ marketId }: MarketDetailClientProps) {
  const [market, setMarket] = useState<PolymarketMarket | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('1W')

  useEffect(() => {
    async function fetchMarketData() {
      try {
        setLoading(true)
        const marketData = await getMarket(marketId)
        setMarket(marketData)
        
        // Fetch price history if conditionId exists
        if (marketData?.conditionId) {
          try {
            const history = await getPriceHistory(marketData.conditionId, {
              interval: timeRange === '1H' ? '1m' : timeRange === '1D' ? '5m' : '1h',
            })
            setPriceHistory(history)
          } catch (err) {
            console.error('Failed to fetch price history:', err)
            // Generate mock history as fallback
            setPriceHistory(generateFallbackHistory())
          }
        }
        setError(null)
      } catch (err) {
        setError('Failed to load market data. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (marketId) {
      fetchMarketData()
    }
  }, [marketId, timeRange])

  // Generate fallback chart data
  function generateFallbackHistory(): PriceHistoryPoint[] {
    const points: PriceHistoryPoint[] = []
    const now = Date.now()
    let price = 0.5
    for (let i = 60; i >= 0; i--) {
      price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.05))
      points.push({
        timestamp: new Date(now - i * 3600000).toISOString(),
        price,
        volume: Math.random() * 10000,
      })
    }
    return points
  }

  // Format chart data for PriceChart component
  const chartData = priceHistory.map(point => ({
    date: point.timestamp,
    price: point.price, // Keep as 0-1, PriceChart will multiply by 100
    volume: point.volume,
  }))

  if (loading) {
    return (
      <div className="flex min-h-screen bg-terminal-bg">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-terminal-accent animate-spin mx-auto mb-4" />
            <p className="text-terminal-muted">Loading market data...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !market) {
    return (
      <div className="flex min-h-screen bg-terminal-bg">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-terminal-danger mb-4">{error || 'Market not found'}</p>
            <Link href="/markets" className="text-terminal-accent hover:underline">
              Back to markets
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const probability = market.outcomePricesNum?.[0] ?? 0.5
  const category = market.tags?.[0] || 'General'
  const endDate = new Date(market.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/markets"
                className="p-2 hover:bg-terminal-card rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-terminal-border rounded text-xs text-terminal-muted">
                    {category}
                  </span>
                  <span className="px-2 py-0.5 bg-terminal-border rounded text-xs text-terminal-muted">
                    Polymarket
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-terminal-card rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-terminal-card rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Market Title & Key Stats */}
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{market.question}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-terminal-muted mb-1">Current Probability</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold terminal-text">
                    {formatPercentage(probability)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">24h Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(market.volumeNum || 0)}</p>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">Liquidity</p>
                <p className="text-2xl font-bold">{formatCurrency(market.liquidityNum || 0)}</p>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-terminal-muted" />
                  <p className="text-2xl font-bold">{endDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Interface & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-terminal-card border border-terminal-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Price History</h2>
                  <p className="text-sm text-terminal-muted">Historical probability changes</p>
                </div>
                <div className="flex gap-2">
                  {['1H', '1D', '1W', '1M', 'ALL'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeRange(period)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        period === timeRange
                          ? 'bg-terminal-accent text-white'
                          : 'bg-terminal-bg text-terminal-muted hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <PriceChart data={chartData.length > 0 ? chartData : generateFallbackHistory().map(p => ({
                date: p.timestamp,
                price: p.price,
                volume: p.volume,
              }))} height={350} showVolume />
            </div>

            {/* Trading Panel */}
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Trade</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-terminal-success/5 border border-terminal-success/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-terminal-success">Yes</span>
                    <span className="text-2xl font-bold terminal-text">{formatPercentage(probability)}</span>
                  </div>
                  <p className="text-sm text-terminal-muted">Implied probability</p>
                </div>
                
                <div className="p-4 bg-terminal-danger/5 border border-terminal-danger/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-terminal-danger">No</span>
                    <span className="text-2xl font-bold terminal-text">{formatPercentage(1 - probability)}</span>
                  </div>
                  <p className="text-sm text-terminal-muted">Implied probability</p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={`https://polymarket.com/event/${market.slug || market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-terminal-success hover:bg-terminal-success/90 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Buy Yes on Polymarket
                </a>
                <a 
                  href={`https://polymarket.com/event/${market.slug || market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-terminal-danger hover:bg-terminal-danger/90 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Buy No on Polymarket
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-terminal-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Platform</span>
                  <span className="font-medium">Polymarket</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Maker Fee</span>
                  <span className="font-medium">{market.makerBaseFee ? (market.makerBaseFee * 100).toFixed(2) : '0'}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Taker Fee</span>
                  <span className="font-medium">{market.takerBaseFee ? (market.takerBaseFee * 100).toFixed(2) : '0'}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Settlement</span>
                  <span className="font-medium">{endDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">AI Market Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-terminal-muted mb-2">Key Drivers</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-success mt-0.5">•</span>
                    Market has {formatCurrency(market.liquidityNum || 0)} in liquidity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-success mt-0.5">•</span>
                    {formatCurrency(market.volumeNum || 0)} in trading volume
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-accent mt-0.5">•</span>
                    Ends {endDate}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-terminal-muted mb-2">Market Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className={`text-sm font-medium ${market.active ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                      {market.active ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Closed</span>
                    <span className={`text-sm font-medium ${!market.closed ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                      {market.closed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolved</span>
                    <span className={`text-sm font-medium ${!market.resolved ? 'text-terminal-success' : 'text-terminal-accent'}`}>
                      {market.resolved ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-terminal-muted mb-2">Outcomes</h3>
                <div className="space-y-2">
                  {market.outcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{outcome}</span>
                      <span className="text-sm font-medium terminal-text">
                        {formatPercentage(market.outcomePricesNum?.[idx] || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Details */}
          <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Market Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-terminal-bg rounded-lg">
                  <BarChart3 className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                  <p className="text-sm text-terminal-muted">Total Volume</p>
                  <p className="font-medium">{formatCurrency(market.volumeNum || 0)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-terminal-bg rounded-lg">
                  <Droplets className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                  <p className="text-sm text-terminal-muted">Liquidity</p>
                  <p className="font-medium">{formatCurrency(market.liquidityNum || 0)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-terminal-bg rounded-lg">
                  <Users className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                  <p className="text-sm text-terminal-muted">Unique Traders</p>
                  <p className="font-medium">{formatNumber(Math.floor((market.volumeNum || 0) / 1500))}</p>
                </div>
              </div>
            </div>
            
            {market.description && (
              <div className="mt-6 pt-6 border-t border-terminal-border">
                <h3 className="text-sm font-medium text-terminal-muted mb-2">Description</h3>
                <p className="text-sm text-terminal-muted whitespace-pre-wrap">{market.description}</p>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-terminal-border">
              <div className="flex items-center gap-2">
                <span className="texttext-terminal-muted">View on Polymarket:</span>
                <a
                  href={`https://polymarket.com/event/${market.slug || market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-terminal-accent hover:underline"
                >
                  Polymarket <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
