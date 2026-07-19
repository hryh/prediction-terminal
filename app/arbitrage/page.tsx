'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  Scale,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ArbitragePage() {
  const [minROI, setMinROI] = useState(0)
  const [minLiquidity, setMinLiquidity] = useState(0)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const verifiedOpportunities: never[] = []

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
              <p className="text-3xl font-bold">{verifiedOpportunities.length}</p>
              <p className="text-xs text-terminal-muted mt-1">Verified live only</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Avg ROI</p>
              <p className="text-3xl font-bold text-terminal-success">
                0.0%
              </p>
              <p className="text-xs text-terminal-muted mt-1">No synthetic ROI</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Total Liquidity</p>
              <p className="text-3xl font-bold">
                {formatCurrency(0)}
              </p>
              <p className="text-xs text-terminal-muted mt-1">Requires second venue feed</p>
            </div>
            <div className="bg-terminal-card border border-terminal-border rounded-xl p-6">
              <p className="text-sm text-terminal-muted mb-1">Profit Potential</p>
              <p className="text-3xl font-bold text-terminal-success">
                {formatCurrency(0)}
              </p>
              <p className="text-xs text-terminal-muted mt-1">Not estimated</p>
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
                
                {verifiedOpportunities.length > 0 ? (
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
                      <tbody />
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Scale className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No verified arbitrage opportunities</h3>
                    <p className="text-sm text-terminal-muted max-w-xl mx-auto">
                      This screen no longer uses premade opportunities. Connect a second live venue such as Kalshi with comparable market mappings before showing ROI, liquidity, or execution actions.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 bg-terminal-card border border-terminal-border rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-terminal-warning mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Arbitrage data policy</h3>
                    <p className="text-sm text-terminal-muted">
                      A valid opportunity must come from two live, comparable order books after fees and settlement differences. Until that data is connected, the app reports zero instead of estimating or fabricating opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
