'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { mockArbitrage, ArbitrageOpportunity } from '@/lib/mock-data'
import {
  Scale,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function ArbitragePage() {
  const [minROI, setMinROI] = useState(0)
  const [minLiquidity, setMinLiquidity] = useState(0)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const filteredOpportunities = mockArbitrage.filter((opp) => {
    const matchesROI = opp.roi >= minROI
    const matchesLiquidity = opp.liquidity >= minLiquidity
    const matchesPlatform = selectedPlatforms.length === 0 || 
      selectedPlatforms.includes(opp.platformA) || 
      selectedPlatforms.includes(opp.platformB)
    return matchesROI && matchesLiquidity && matchesPlatform
  })

  const totalProfitPotential = filteredOpportunities.reduce(
    (acc, opp) => acc + (opp.liquidity * opp.roi) / 100,
    0
  )

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
                  <Scale className="w-6 h-6 text-terminal-accent" />
                  Arbitrage Screener
                </h1>
                <p className="text-sm text-terminal-muted">
                  Cross-platform price discrepancies and executable opportunities
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm hover:bg-terminal-border transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Active Opportunities</p>
              <p className="text-3xl font-bold">{filteredOpportunities.length}</p>
              <p className="text-xs text-terminal-success mt-1">Across 2 platforms</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Avg ROI</p>
              <p className="text-3xl font-bold text-terminal-success">
                {filteredOpportunities.length > 0
                  ? (filteredOpportunities.reduce((acc, o) => acc + o.roi, 0) / filteredOpportunities.length).toFixed(1)
                  : 0}%
              </p>
              <p className="text-xs text-terminal-muted mt-1">After fees</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Total Liquidity</p>
              <p className="text-3xl font-bold">
                {formatCurrency(filteredOpportunities.reduce((acc, o) => acc + o.liquidity, 0))}
              </p>
              <p className="text-xs text-terminal-muted mt-1">Available for arbitrage</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Profit Potential</p>
              <p className="text-3xl font-bold text-terminal-success">
                {formatCurrency(totalProfitPotential)}
              </p>
              <p className="text-xs text-terminal-muted mt-1">Theoretical max</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="bg-terminal-card border border-terminal-border rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5" />
                  <h2 className="font-semibold">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Min ROI */}
                  <div>
                    <label className="text-sm text-terminal-muted mb-2 block">
                      Min ROI: {minROI}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={minROI}
                      onChange={(e) => setMinROI(Number(e.target.value))}
                      className="w-full h-2 bg-terminal-bg rounded-lg appearance-none cursor-pointer accent-terminal-accent"
                    />
                    <div className="flex justify-between text-xs text-terminal-muted mt-1">
                      <span>0%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  {/* Min Liquidity */}
                  <div>
                    <label className="text-sm text-terminal-muted mb-2 block">
                      Min Liquidity: {formatCurrency(minLiquidity)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={minLiquidity}
                      onChange={(e) => setMinLiquidity(Number(e.target.value))}
                      className="w-full h-2 bg-terminal-bg rounded-lg appearance-none cursor-pointer accent-terminal-accent"
                    />
                    <div className="flex justify-between text-xs text-terminal-muted mt-1">
                      <span>$0</span>
                      <span>$1M</span>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="text-sm text-terminal-muted mb-3 block">Platforms</label>
                    <div className="space-y-2">
                      {['Polymarket', 'Kalshi'].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlatforms.includes(platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPlatforms([...selectedPlatforms, platform])
                              } else {
                                setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
                              }
                            }}
                            className="w-4 h-4 rounded border-terminal-border bg-terminal-bg text-terminal-accent focus:ring-terminal-accent"
                          />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMinROI(0)
                      setMinLiquidity(0)
                      setSelectedPlatforms([])
                    }}
                    className="w-full py-2 text-sm text-terminal-muted hover:text-white transition-colors"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </div>

            {/* Opportunities Table */}
            <div className="lg:col-span-3">
              <div className="bg-terminal-card border border-terminal-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-terminal-border">
                  <h2 className="font-semibold">Arbitrage Opportunities</h2>
                </div>
                
                {filteredOpportunities.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-terminal-border">
                          <th className="text-left px-6 py-4 text-sm font-medium text-terminal-muted">Market</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Price A</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Price B</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">ROI</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Liquidity</th>
                          <th className="text-center px-6 py-4 text-sm font-medium text-terminal-muted">Confidence</th>
                          <th className="text-right px-6 py-4 text-sm font-medium text-terminal-muted">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOpportunities.map((opp) => (
                          <tr key={opp.id} className="border-b border-terminal-border hover:bg-terminal-border/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium line-clamp-2 max-w-xs">{opp.market}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-terminal-muted">{opp.platformA}</span>
                                <ArrowRight className="w-3 h-3 text-terminal-muted" />
                                <span className="text-xs text-terminal-muted">{opp.platformB}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-medium terminal-text">{formatPercentage(opp.priceA)}</p>
                              <p className="text-xs text-terminal-muted">{opp.platformA}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-medium terminal-text">{formatPercentage(opp.priceB)}</p>
                              <p className="text-xs text-terminal-muted">{opp.platformB}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-terminal-success/10 text-terminal-success rounded-full text-sm font-medium">
                                <TrendingUp className="w-3 h-3" />
                                +{opp.roi.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-medium">{formatCurrency(opp.liquidity)}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-2 bg-terminal-bg rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-terminal-accent rounded-full"
                                    style={{ width: `${opp.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm">{(opp.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="px-4 py-2 bg-terminal-accent hover:bg-terminal-accent/90 text-white text-sm font-medium rounded-lg transition-colors">
                                Execute
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Scale className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
                    <p className="text-sm text-terminal-muted">Try adjusting your filters</p>
                  </div>
                )}
              </div>

              {/* How It Works */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-terminal-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Scale className="w-5 h-5 text-terminal-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Price Comparison</h3>
                  <p className="text-sm text-terminal-muted">
                    We continuously scan multiple prediction markets to identify price discrepancies for identical outcomes.
                  </p>
                </div>
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-terminal-success/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-terminal-success" />
                  </div>
                  <h3 className="font-semibold mb-2">Execution Analysis</h3>
                  <p className="text-sm text-terminal-muted">
                    Each opportunity is analyzed for liquidity, fees, and execution time to ensure profitable trades.
                  </p>
                </div>
                <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-terminal-warning/10 rounded-lg flex items-center justify-center mb-4">
                    <AlertCircle className="w-5 h-5 text-terminal-warning" />
                  </div>
                  <h3 className="font-semibold mb-2">Risk Assessment</h3>
                  <p className="text-sm text-terminal-muted">
                    Confidence scores account for settlement risk, platform reliability, and market volatility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
