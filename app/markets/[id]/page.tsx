'use client'

import { useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import PriceChart from '@/components/PriceChart'
import WhaleActivity from '@/components/WhaleActivity'
import NewsCard from '@/components/NewsCard'
import {
  mockMarkets,
  mockWhaleActivity,
  mockNews,
  generateChartData,
} from '@/lib/mock-data'
import {
  ArrowLeft,
  Share2,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Droplets,
  BarChart3,
  Calendar,
  ExternalLink,
  Sparkles,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils'

export default function MarketDetailPage() {
  const params = useParams()
  const marketId = params.id as string
  
  // Find market by ID (in real app, this would be an API call)
  const market = mockMarkets.find(m => m.id === marketId) || mockMarkets[0]
  const chartData = generateChartData(60)
  const relatedNews = mockNews.filter(n => 
    n.affectedMarkets.some(m => m.includes(market.category))
  ).slice(0, 3)

  const isPositive = market.change24h >= 0

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-terminal-card rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-terminal-border rounded text-xs text-terminal-muted">
                    {market.category}
                  </span>
                  <span className="px-2 py-0.5 bg-terminal-border rounded text-xs text-terminal-muted">
                    {market.source}
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{market.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-terminal-muted mb-1">Current Probability</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold terminal-text">
                    {formatPercentage(market.probability)}
                  </p>
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-terminal-success' : 'text-terminal-danger'}`}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="font-medium">{isPositive ? '+' : ''}{formatPercentage(market.change24h)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">24h Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(market.volume)}</p>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">Liquidity</p>
                <p className="text-2xl font-bold">{formatCurrency(market.liquidity)}</p>
              </div>
              
              <div>
                <p className="text-sm text-terminal-muted mb-1">End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-terminal-muted" />
                  <p className="text-2xl font-bold">{market.endDate}</p>
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
              <PriceChart data={chartData} height={350} showVolume />
            </div>

            {/* Trading Panel */}
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Trade</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-terminal-success/5 border border-terminal-success/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-terminal-success">Yes</span>
                    <span className="text-2xl font-bold terminal-text">{formatPercentage(market.probability)}</span>
                  </div>
                  <p className="text-sm text-terminal-muted">Implied probability</p>
                </div>
                
                <div className="p-4 bg-terminal-danger/5 border border-terminal-danger/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-terminal-danger">No</span>
                    <span className="text-2xl font-bold terminal-text">{formatPercentage(1 - market.probability)}</span>
                  </div>
                  <p className="text-sm text-terminal-muted">Implied probability</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-terminal-success hover:bg-terminal-success/90 text-white font-medium rounded-lg transition-colors">
                  Buy Yes
                </button>
                <button className="w-full py-3 bg-terminal-danger hover:bg-terminal-danger/90 text-white font-medium rounded-lg transition-colors">
                  Buy No
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-terminal-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Platform</span>
                  <span className="font-medium">{market.source}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Fee</span>
                  <span className="font-medium">2%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-terminal-muted">Settlement</span>
                  <span className="font-medium">{market.endDate}</span>
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
                    Recent polling data favors outcome
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-success mt-0.5">•</span>
                    Historical precedent suggests high probability
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terminal-danger mt-0.5">•</span>
                    Recent volatility in related markets
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-terminal-muted mb-2">Sentiment Analysis</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-terminal-bg rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-gradient-to-r from-terminal-success to-terminal-accent rounded-full" />
                    </div>
                  </div>
                  <span className="text-sm font-medium">65% Bullish</span>
                </div>
                <p className="text-sm text-terminal-muted mt-2">
                  Based on 1,247 social mentions and news articles
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-terminal-muted mb-2">AI Confidence</h3>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-terminal-accent">78%</div>
                  <div className="text-xs text-terminal-muted">
                    Model prediction<br />accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column: Whale Activity & News */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Whale Activity</h2>
              <WhaleActivity activities={mockWhaleActivity.filter(w => w.market === market.title)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Related News</h2>
              <div className="space-y-4">
                {relatedNews.length > 0 ? (
                  relatedNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))
                ) : (
                  <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 text-center">
                    <p className="text-terminal-muted">No recent news for this market</p>
                  </div>
                )}
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
                  <p className="font-medium">{formatCurrency(market.volume)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-terminal-bg rounded-lg">
                  <Droplets className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                  <p className="text-sm text-terminal-muted">Liquidity</p>
                  <p className="font-medium">{formatCurrency(market.liquidity)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-terminal-bg rounded-lg">
                  <Users className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                  <p className="text-sm text-terminal-muted">Unique Traders</p>
                  <p className="font-medium">{formatNumber(Math.floor(market.volume / 1500))}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-terminal-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-terminal-muted">View on {market.source}:</span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-sm text-terminal-accent hover:underline"
                >
                  {market.source} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
