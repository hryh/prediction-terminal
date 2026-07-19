export interface Market {
  id: string
  title: string
  category: string
  probability: number
  volume: number
  liquidity: number
  change24h: number
  icon?: string
  endDate: string
  source: 'Polymarket' | 'Kalshi'
}

export interface NewsItem {
  id: string
  title: string
  source: string
  timestamp: Date
  affectedMarkets: string[]
  impact: 'high' | 'medium' | 'low'
  summary: string
}

export interface ArbitrageOpportunity {
  id: string
  market: string
  platformA: string
  platformB: string
  priceA: number
  priceB: number
  roi: number
  liquidity: number
  confidence: number
  executionTime: string
}

export interface WhaleActivity {
  id: string
  address: string
  market: string
  action: 'buy' | 'sell'
  amount: number
  timestamp: Date
  probability: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  category: 'economic' | 'political' | 'crypto' | 'sports'
  affectedMarkets: string[]
  importance: 'high' | 'medium' | 'low'
}

export interface PortfolioPosition {
  id: string
  market: string
  position: 'yes' | 'no'
  amount: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

// Mock Markets
export const mockMarkets: Market[] = [
  {
    id: '1',
    title: 'Will Trump win the 2024 US Presidential Election?',
    category: 'Politics',
    probability: 0.52,
    volume: 450000000,
    liquidity: 25000000,
    change24h: 0.03,
    endDate: '2024-11-05',
    source: 'Polymarket',
  },
  {
    id: '2',
    title: 'Will Bitcoin reach $100K by end of 2024?',
    category: 'Crypto',
    probability: 0.34,
    volume: 89000000,
    liquidity: 8000000,
    change24h: -0.05,
    endDate: '2024-12-31',
    source: 'Polymarket',
  },
  {
    id: '3',
    title: 'Will Fed cut rates in September 2024?',
    category: 'Economics',
    probability: 0.78,
    volume: 120000000,
    liquidity: 15000000,
    change24h: 0.12,
    endDate: '2024-09-18',
    source: 'Kalshi',
  },
  {
    id: '4',
    title: 'Will there be a US government shutdown in 2024?',
    category: 'Politics',
    probability: 0.21,
    volume: 45000000,
    liquidity: 5000000,
    change24h: -0.08,
    endDate: '2024-09-30',
    source: 'Polymarket',
  },
  {
    id: '5',
    title: 'Will ETH ETF be approved by SEC in 2024?',
    category: 'Crypto',
    probability: 0.89,
    volume: 67000000,
    liquidity: 12000000,
    change24h: 0.15,
    endDate: '2024-12-31',
    source: 'Polymarket',
  },
  {
    id: '6',
    title: 'Will Ukraine conflict end by end of 2024?',
    category: 'Geopolitics',
    probability: 0.12,
    volume: 34000000,
    liquidity: 4000000,
    change24h: -0.02,
    endDate: '2024-12-31',
    source: 'Kalshi',
  },
]

// Mock News
export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Fed Chair Powell hints at potential rate cuts in coming meetings',
    source: 'Reuters',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    affectedMarkets: ['Will Fed cut rates in September 2024?'],
    impact: 'high',
    summary: 'Powell\'s dovish tone at Jackson Hole symposium increases market expectations for September rate cut.',
  },
  {
    id: '2',
    title: 'Trump leads in latest swing state polls',
    source: 'AP',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    affectedMarkets: ['Will Trump win the 2024 US Presidential Election?'],
    impact: 'high',
    summary: 'New polling shows Trump ahead in Pennsylvania, Michigan, and Wisconsin.',
  },
  {
    id: '3',
    title: 'SEC extends review period for additional crypto ETF applications',
    source: 'CoinDesk',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    affectedMarkets: ['Will ETH ETF be approved by SEC in 2024?'],
    impact: 'medium',
    summary: 'Regulatory delays may push some ETF decisions to 2025.',
  },
  {
    id: '4',
    title: 'Bitcoin whale moves $500M to exchanges',
    source: 'Whale Alert',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    affectedMarkets: ['Will Bitcoin reach $100K by end of 2024?'],
    impact: 'medium',
    summary: 'Large transfer to exchanges often precedes selling pressure.',
  },
]

// Mock Arbitrage Opportunities
export const mockArbitrage: ArbitrageOpportunity[] = [
  {
    id: '1',
    market: 'Will Trump win the 2024 US Presidential Election?',
    platformA: 'Polymarket',
    platformB: 'Kalshi',
    priceA: 0.52,
    priceB: 0.48,
    roi: 8.3,
    liquidity: 500000,
    confidence: 0.92,
    executionTime: '< 30s',
  },
  {
    id: '2',
    market: 'Will Fed cut rates in September 2024?',
    platformA: 'Kalshi',
    platformB: 'Polymarket',
    priceA: 0.78,
    priceB: 0.72,
    roi: 8.3,
    liquidity: 300000,
    confidence: 0.88,
    executionTime: '< 45s',
  },
  {
    id: '3',
    market: 'Will ETH ETF be approved by SEC in 2024?',
    platformA: 'Polymarket',
    platformB: 'Kalshi',
    priceA: 0.89,
    priceB: 0.85,
    roi: 4.7,
    liquidity: 200000,
    confidence: 0.85,
    executionTime: '< 60s',
  },
]

// Mock Whale Activity
export const mockWhaleActivity: WhaleActivity[] = [
  {
    id: '1',
    address: '0x7a2...9f3b',
    market: 'Will Trump win the 2024 US Presidential Election?',
    action: 'buy',
    amount: 125000,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    probability: 0.52,
  },
  {
    id: '2',
    address: '0x3b1...8c2a',
    market: 'Will Bitcoin reach $100K by end of 2024?',
    action: 'sell',
    amount: 89000,
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    probability: 0.34,
  },
  {
    id: '3',
    address: '0x9f4...2d1e',
    market: 'Will Fed cut rates in September 2024?',
    action: 'buy',
    amount: 234000,
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    probability: 0.78,
  },
]

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'CPI Report Release',
    date: new Date('2024-09-11'),
    category: 'economic',
    affectedMarkets: ['Will Fed cut rates in September 2024?', 'Inflation-related markets'],
    importance: 'high',
  },
  {
    id: '2',
    title: 'FOMC Meeting',
    date: new Date('2024-09-18'),
    category: 'economic',
    affectedMarkets: ['Will Fed cut rates in September 2024?'],
    importance: 'high',
  },
  {
    id: '3',
    title: 'First Presidential Debate',
    date: new Date('2024-09-10'),
    category: 'political',
    affectedMarkets: ['Will Trump win the 2024 US Presidential Election?'],
    importance: 'high',
  },
  {
    id: '4',
    title: 'SEC ETF Decision Deadline',
    date: new Date('2024-10-15'),
    category: 'crypto',
    affectedMarkets: ['Will ETH ETF be approved by SEC in 2024?'],
    importance: 'medium',
  },
  {
    id: '5',
    title: 'Q3 GDP Report',
    date: new Date('2024-10-30'),
    category: 'economic',
    affectedMarkets: ['Economic growth markets'],
    importance: 'medium',
  },
]

// Mock Portfolio
export const mockPortfolio: PortfolioPosition[] = [
  {
    id: '1',
    market: 'Will Trump win the 2024 US Presidential Election?',
    position: 'yes',
    amount: 5000,
    entryPrice: 0.45,
    currentPrice: 0.52,
    pnl: 777.78,
    pnlPercent: 15.56,
  },
  {
    id: '2',
    market: 'Will Bitcoin reach $100K by end of 2024?',
    position: 'no',
    amount: 3000,
    entryPrice: 0.42,
    currentPrice: 0.34,
    pnl: 571.43,
    pnlPercent: 19.05,
  },
  {
    id: '3',
    market: 'Will Fed cut rates in September 2024?',
    position: 'yes',
    amount: 8000,
    entryPrice: 0.65,
    currentPrice: 0.78,
    pnl: 1600,
    pnlPercent: 20.0,
  },
]

// Mock Chart Data
export const generateChartData = (days: number = 30) => {
  const data = []
  let price = 0.5
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    price = price + (Math.random() - 0.5) * 0.05
    price = Math.max(0.05, Math.min(0.95, price))
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: price,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    })
  }
  
  return data
}
