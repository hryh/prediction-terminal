'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MarketCard from '@/components/MarketCard'
import { getMarkets, PolymarketMarket } from '@/lib/api'
import { Search, Filter, Grid3X3, List, TrendingUp, Loader2 } from 'lucide-react'

const categories = ['All', 'Politics', 'Crypto', 'Sports', 'Tech', 'Science', 'Pop Culture']
const sortOptions = [
  { label: 'Volume', value: 'volume' },
  { label: 'Liquidity', value: 'liquidity' },
  { label: 'Newest', value: 'createdAt' },
  { label: 'Ending Soon', value: 'endDate' },
]

export default function MarketsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [markets, setMarkets] = useState<PolymarketMarket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('volume')

  useEffect(() => {
    async function fetchMarkets() {
      try {
        setLoading(true)
        const data = await getMarkets({
          limit: 100,
          active: true,
          sort: sortBy as 'volume' | 'liquidity' | 'createdAt' | 'endDate',
          order: 'desc',
        })
        setMarkets(data)
        setError(null)
      } catch (err) {
        setError('Failed to load markets. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
  }, [sortBy])

  const filteredMarkets = markets.filter(market => {
    const matchesCategory = selectedCategory === 'All' || 
      market.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-terminal-bg">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Markets</h1>
                <p className="text-sm text-terminal-muted">Explore all prediction markets</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm focus:outline-none focus:border-terminal-accent"
                />
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-terminal-card border border-terminal-border rounded-lg text-sm hover:bg-terminal-border transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-1 bg-terminal-card border border-terminal-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-terminal-border' : 'hover:bg-terminal-border'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-terminal-border' : 'hover:bg-terminal-border'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-terminal-accent text-white'
                      : 'bg-terminal-card text-terminal-muted hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-terminal-muted">
              {loading ? 'Loading markets...' : `Showing ${filteredMarkets.length} markets`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-terminal-muted">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-terminal-card border border-terminal-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-terminal-accent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-terminal-accent animate-spin" />
              <span className="ml-3 text-terminal-muted">Loading markets...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-terminal-danger mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-terminal-accent hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Markets Grid */}
          {!loading && !error && filteredMarkets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          ) : !loading && !error && (
            <div className="text-center py-20">
              <TrendingUp className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No markets found</h3>
              <p className="text-sm text-terminal-muted">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
