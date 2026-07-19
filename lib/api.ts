// Polymarket API Client
// Uses Next.js API routes to avoid CORS issues

const API_BASE = '';  // Empty for same-origin requests

// Types based on Polymarket API response
export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  endDate: string;
  startDate: string;
  liquidity: string;
  liquidityNum: number;
  volume: string;
  volumeNum: number;
  volumeClob: number;
  active: boolean;
  closed: boolean;
  resolved: boolean;
  outcomes: string[];
  outcomePrices: string[];
  outcomePricesNum?: number[];
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  clobTokenIds?: string[];
  acceptingOrders: boolean;
  negRisk: boolean;
  makerBaseFee: number;
  takerBaseFee: number;
  events?: PolymarketEvent[];
}

export interface PolymarketEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
}

export interface UserPosition {
  marketId: string;
  conditionId: string;
  question: string;
  outcome: string;
  size: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  value: number;
}

export interface PriceHistoryPoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface MarketTrade {
  id: string;
  transactionHash: string;
  marketId: string;
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  timestamp: string;
  makerAddress: string;
  takerAddress: string;
}

// Mock markets for fallback when API fails
const MOCK_MARKETS: PolymarketMarket[] = [
  {
    id: 'mock-market-1',
    question: 'Will Bitcoin hit $100,000 by end of 2024?',
    conditionId: '0xbtc100k2024',
    slug: 'bitcoin-100k-2024',
    description: 'This market resolves to Yes if Bitcoin trades at or above $100,000 on any major exchange before January 1, 2025.',
    image: 'https://polymarket.com/_next/image?url=%2Fimages%2Fbtc.png&w=128&q=75',
    endDate: '2024-12-31T23:59:59Z',
    startDate: '2024-01-01T00:00:00Z',
    liquidity: '$2.5M',
    liquidityNum: 2500000,
    volume: '$15.2M',
    volumeNum: 15200000,
    volumeClob: 12000000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.72', '0.28'],
    outcomePricesNum: [0.72, 0.28],
    category: 'Crypto',
    tags: ['Bitcoin', 'Crypto', 'Price'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.01,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
  {
    id: 'mock-market-2',
    question: 'Will Donald Trump win the 2024 US Presidential Election?',
    conditionId: '0xtrump2024',
    slug: 'trump-wins-2024',
    description: 'This market resolves to Yes if Donald Trump is declared the winner of the 2024 US Presidential Election.',
    image: 'https://polymarket.com/_next/image?url=%2Fimages%2Ftrump.png&w=128&q=75',
    endDate: '2024-11-05T23:59:59Z',
    startDate: '2024-01-01T00:00:00Z',
    liquidity: '$45.2M',
    liquidityNum: 45200000,
    volume: '$892.5M',
    volumeNum: 892500000,
    volumeClob: 800000000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.51', '0.49'],
    outcomePricesNum: [0.51, 0.49],
    category: 'Politics',
    tags: ['Election', 'Trump', 'Politics'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.001,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
  {
    id: 'mock-market-3',
    question: 'Will ETH ETF be approved by SEC in 2024?',
    conditionId: '0xeth etf2024',
    slug: 'eth-etf-approval-2024',
    description: 'This market resolves to Yes if the SEC approves at least one spot Ethereum ETF before January 1, 2025.',
    image: 'https://polymarket.com/_next/image?url=%2Fimages%2Feth.png&w=128&q=75',
    endDate: '2024-12-31T23:59:59Z',
    startDate: '2024-01-01T00:00:00Z',
    liquidity: '$1.8M',
    liquidityNum: 1800000,
    volume: '$8.5M',
    volumeNum: 8500000,
    volumeClob: 7000000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.85', '0.15'],
    outcomePricesNum: [0.85, 0.15],
    category: 'Crypto',
    tags: ['Ethereum', 'ETF', 'SEC'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.01,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
  {
    id: 'mock-market-4',
    question: 'Will there be a US government shutdown in 2024?',
    conditionId: '0xshutdown2024',
    slug: 'us-government-shutdown-2024',
    description: 'This market resolves to Yes if any part of the US federal government shuts down due to lack of funding in 2024.',
    endDate: '2024-12-31T23:59:59Z',
    startDate: '2024-01-01T00:00:00Z',
    liquidity: '$890K',
    liquidityNum: 890000,
    volume: '$3.2M',
    volumeNum: 3200000,
    volumeClob: 2800000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.23', '0.77'],
    outcomePricesNum: [0.23, 0.77],
    category: 'Politics',
    tags: ['Government', 'Shutdown', 'US'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.01,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
  {
    id: 'mock-market-5',
    question: 'Will Taylor Swift win Album of the Year at 2025 Grammys?',
    conditionId: '0xswift2025',
    slug: 'taylor-swift-grammy-2025',
    description: 'This market resolves to Yes if Taylor Swift wins the Album of the Year award at the 2025 Grammy Awards.',
    image: 'https://polymarket.com/_next/image?url=%2Fimages%2Fgrammy.png&w=128&q=75',
    endDate: '2025-02-02T23:59:59Z',
    startDate: '2024-06-01T00:00:00Z',
    liquidity: '$450K',
    liquidityNum: 450000,
    volume: '$1.8M',
    volumeNum: 1800000,
    volumeClob: 1500000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.34', '0.66'],
    outcomePricesNum: [0.34, 0.66],
    category: 'Entertainment',
    tags: ['Music', 'Grammy', 'Taylor Swift'],
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.01,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
  {
    id: 'mock-market-6',
    question: 'Will SpaceX Starship reach orbit successfully in 2024?',
    conditionId: '0xstarship2024',
    slug: 'spacex-starship-orbit-2024',
    description: 'This market resolves to Yes if SpaceX Starship completes a successful orbital flight in 2024.',
    image: 'https://polymarket.com/_next/image?url=%2Fimages%2Fspacex.png&w=128&q=75',
    endDate: '2024-12-31T23:59:59Z',
    startDate: '2024-01-01T00:00:00Z',
    liquidity: '$1.2M',
    liquidityNum: 1200000,
    volume: '$5.5M',
    volumeNum: 5500000,
    volumeClob: 4800000,
    active: true,
    closed: false,
    resolved: false,
    outcomes: ['Yes', 'No'],
    outcomePrices: ['0.68', '0.32'],
    outcomePricesNum: [0.68, 0.32],
    category: 'Science',
    tags: ['SpaceX', 'Starship', 'Space'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    enableOrderBook: true,
    orderPriceMinTickSize: 0.01,
    orderMinSize: 1,
    acceptingOrders: true,
    negRisk: false,
    makerBaseFee: 0.002,
    takerBaseFee: 0.002,
  },
];

// Get base URL for API calls (works in both browser and server)
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL
    return '';
  }
  // Server: during build, API isn't running - use direct Gamma API
  // During runtime on Vercel, use relative URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // During build or local dev server not running
  return null as any;
}

// Check if we're in build/static generation context
function isBuildTime(): boolean {
  return typeof window === 'undefined' && !process.env.VERCEL_URL;
}

// Gamma API direct URL (for server-side calls during build)
const GAMMA_API = 'https://gamma-api.polymarket.com';

// Internal API - Markets (proxies to Gamma API)
export async function getMarkets(params?: {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  resolved?: boolean;
  sort?: 'volume' | 'liquidity' | 'createdAt' | 'endDate';
  order?: 'asc' | 'desc';
  tag?: string;
  search?: string;
}): Promise<PolymarketMarket[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.active !== undefined) queryParams.set('active', params.active.toString());
  if (params?.closed !== undefined) queryParams.set('closed', params.closed.toString());
  if (params?.resolved !== undefined) queryParams.set('resolved', params.resolved.toString());
  if (params?.sort) queryParams.set('sort', params.sort);
  if (params?.order) queryParams.set('order', params.order);
  if (params?.tag) queryParams.set('tag', params.tag);
  if (params?.search) queryParams.set('search', params.search);

  // During build time, use direct Gamma API (no CORS issues server-side)
  // During runtime, use our internal API route
  const isServer = typeof window === 'undefined';
  const apiUrl = isServer 
    ? `${GAMMA_API}/markets?${queryParams.toString()}`
    : `/api/markets?${queryParams.toString()}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('API returned error, using mock data');
      return getFilteredMockMarkets(params);
    }
    
    const data = await response.json();
    
    // Parse outcome prices from strings to numbers
    return data.map((market: PolymarketMarket) => {
      let prices: number[] = [];
      if (Array.isArray(market.outcomePrices)) {
        prices = market.outcomePrices.map((p: string) => parseFloat(p) || 0);
      }
      return {
        ...market,
        outcomePricesNum: prices,
      };
    });
  } catch (error) {
    console.error('Error fetching markets, using mock data:', error);
    return getFilteredMockMarkets(params);
  }
}

// Helper to filter mock markets based on params
function getFilteredMockMarkets(params?: {
  limit?: number;
  sort?: 'volume' | 'liquidity' | 'createdAt' | 'endDate';
  order?: 'asc' | 'desc';
  search?: string;
}): PolymarketMarket[] {
  let markets = [...MOCK_MARKETS];
  
  // Search filter
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    markets = markets.filter(m => 
      m.question.toLowerCase().includes(searchLower) ||
      m.category?.toLowerCase().includes(searchLower) ||
      m.tags?.some(t => t.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort
  if (params?.sort === 'volume') {
    markets.sort((a, b) => (params.order === 'asc' ? a.volumeNum - b.volumeNum : b.volumeNum - a.volumeNum));
  } else if (params?.sort === 'liquidity') {
    markets.sort((a, b) => (params.order === 'asc' ? a.liquidityNum - b.liquidityNum : b.liquidityNum - a.liquidityNum));
  }
  
  // Limit
  if (params?.limit) {
    markets = markets.slice(0, params.limit);
  }
  
  return markets;
}

// Internal API - Single Market
export async function getMarket(marketId: string): Promise<PolymarketMarket | null> {
  // During build time, use direct Gamma API (no CORS issues server-side)
  // During runtime, use our internal API route
  const isServer = typeof window === 'undefined';
  const apiUrl = isServer
    ? `${GAMMA_API}/markets/${marketId}`
    : `/api/markets/${marketId}`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const mockMarket = MOCK_MARKETS.find(m => m.id === marketId || m.slug === marketId);
      if (mockMarket) return mockMarket;
      return MOCK_MARKETS[0];
    }
    
    const data = await response.json();
    
    // Parse outcome prices
    let prices: number[] = [];
    if (Array.isArray(data.outcomePrices)) {
      prices = data.outcomePrices.map((p: string) => parseFloat(p) || 0);
    }
    
    return {
      ...data,
      outcomePricesNum: prices,
    };
  } catch (error) {
    console.error('Error fetching market, using mock data:', error);
    const mockMarket = MOCK_MARKETS.find(m => m.id === marketId || m.slug === marketId);
    return mockMarket || MOCK_MARKETS[0];
  }
}

// Data API direct URL
const DATA_API = 'https://data-api.polymarket.com';

// Internal API - User Positions
export async function getUserPositions(userAddress: string): Promise<UserPosition[]> {
  // During build time, use direct Data API (no CORS issues server-side)
  // During runtime, use our internal API route
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: try direct API first
    try {
      const response = await fetch(`${DATA_API}/positions?user=${encodeURIComponent(userAddress)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        return getMockPositions(userAddress);
      }
      
      const data = await response.json();
      
      // Transform and calculate PnL
      return data.map((pos: any) => {
        const size = parseFloat(pos.size || pos.amount || 0);
        const avgPrice = parseFloat(pos.avgPrice || pos.price || 0);
        const currentPrice = parseFloat(pos.currentPrice || 0);
        
        const isNo = (pos.outcome || 'Yes').toLowerCase() === 'no';
        
        let pnl: number;
        let value: number;
        let costBasis: number;
        
        if (isNo) {
          const entryPrice = 1 - avgPrice;
          const currentValue = 1 - currentPrice;
          pnl = (currentValue - entryPrice) * size;
          value = currentValue * size;
          costBasis = entryPrice * size;
        } else {
          pnl = (currentPrice - avgPrice) * size;
          value = currentPrice * size;
          costBasis = avgPrice * size;
        }
        
        const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
        
        return {
          marketId: pos.marketId || pos.conditionId,
          conditionId: pos.conditionId,
          question: pos.question || pos.title || 'Unknown Market',
          outcome: pos.outcome || 'Yes',
          size,
          avgPrice,
          currentPrice,
          pnl,
          pnlPercent,
          value,
        };
      });
    } catch (error) {
      console.error('Error fetching positions:', error);
      return getMockPositions(userAddress);
    }
  }
  
  // Client-side: use internal API route
  try {
    const response = await fetch(`/api/positions?user=${encodeURIComponent(userAddress)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch positions: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    return getMockPositions(userAddress);
  }
}

// Mock positions for demo when API is unavailable
function getMockPositions(userAddress: string): UserPosition[] {
  return [
    {
      marketId: 'mock-1',
      conditionId: '0x1234...',
      question: 'Will Bitcoin hit $100k by end of 2024?',
      outcome: 'Yes',
      size: 500,
      avgPrice: 0.65,
      currentPrice: 0.78,
      pnl: (0.78 - 0.65) * 500,  // $65 profit
      pnlPercent: ((0.78 - 0.65) / 0.65) * 100,  // 20%
      value: 0.78 * 500,  // $390
    },
    {
      marketId: 'mock-2',
      conditionId: '0x5678...',
      question: 'Will Trump win the 2024 election?',
      outcome: 'No',
      size: 300,
      avgPrice: 0.40,
      currentPrice: 0.35,
      // NO position: bought at (1-0.40)=0.60, now worth (1-0.35)=0.65
      pnl: ((1 - 0.35) - (1 - 0.40)) * 300,  // $15 profit
      pnlPercent: (((1 - 0.35) - (1 - 0.40)) / (1 - 0.40)) * 100,  // 8.33%
      value: (1 - 0.35) * 300,  // $195
    },
    {
      marketId: 'mock-3',
      conditionId: '0x9abc...',
      question: 'Will ETH ETF be approved in 2024?',
      outcome: 'Yes',
      size: 200,
      avgPrice: 0.80,
      currentPrice: 0.72,
      pnl: (0.72 - 0.80) * 200,  // -$16 loss
      pnlPercent: ((0.72 - 0.80) / 0.80) * 100,  // -10%
      value: 0.72 * 200,  // $144
    },
  ];
}

// Price History - Generate mock data for now (CLOB API requires auth)
export async function getPriceHistory(
  conditionId: string,
  params?: {
    interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    startTs?: number;
    endTs?: number;
  }
): Promise<PriceHistoryPoint[]> {
  // Generate mock price history data
  const points: PriceHistoryPoint[] = [];
  const days = 30;
  const now = Date.now();
  const basePrice = 0.5;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    // Random walk around base price
    const randomChange = (Math.random() - 0.5) * 0.1;
    const price = Math.max(0.01, Math.min(0.99, basePrice + randomChange + (Math.sin(i / 5) * 0.1)));
    
    points.push({
      timestamp,
      price,
      volume: Math.random() * 1000000,
    });
  }
  
  return points;
}

// Helper function to get trending markets (highest volume)
export async function getTrendingMarkets(limit = 10): Promise<PolymarketMarket[]> {
  return getMarkets({
    limit,
    active: true,
    sort: 'volume',
    order: 'desc',
  });
}

// Helper function to get markets ending soon
export async function getEndingSoonMarkets(limit = 10): Promise<PolymarketMarket[]> {
  return getMarkets({
    limit,
    active: true,
    closed: false,
    sort: 'endDate',
    order: 'asc',
  });
}

// Helper function to search markets
export async function searchMarkets(query: string, limit = 20): Promise<PolymarketMarket[]> {
  return getMarkets({
    limit,
    active: true,
    search: query,
  });
}
