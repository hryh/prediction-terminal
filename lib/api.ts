// Polymarket API Client
// Gamma API: Markets, events, tags - https://gamma-api.polymarket.com
// Data API: User positions, trades - https://data-api.polymarket.com
// CLOB API: Orderbook, prices - https://clob.polymarket.com

const GAMMA_API = 'https://gamma-api.polymarket.com';
const DATA_API = 'https://data-api.polymarket.com';
const CLOB_API = 'https://clob.polymarket.com';

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

// Gamma API - Markets
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

  const response = await fetch(`${GAMMA_API}/markets?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch markets: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Parse outcome prices from strings to numbers
  return data.map((market: PolymarketMarket) => ({
    ...market,
    outcomePricesNum: market.outcomePrices?.map((p: string) => parseFloat(p)) || [],
  }));
}

// Gamma API - Single Market
export async function getMarket(marketId: string): Promise<PolymarketMarket> {
  const response = await fetch(`${GAMMA_API}/markets/${marketId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch market: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    ...data,
    outcomePricesNum: data.outcomePrices?.map((p: string) => parseFloat(p)) || [],
  };
}

// Gamma API - Market by Condition ID
export async function getMarketByConditionId(conditionId: string): Promise<PolymarketMarket> {
  const response = await fetch(`${GAMMA_API}/markets?conditionIds=${conditionId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch market: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('Market not found');
  }
  
  return {
    ...data[0],
    outcomePricesNum: data[0].outcomePrices?.map((p: string) => parseFloat(p)) || [],
  };
}

// Gamma API - Events
export async function getEvents(params?: {
  limit?: number;
  active?: boolean;
}): Promise<PolymarketEvent[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.active !== undefined) queryParams.set('active', params.active.toString());

  const response = await fetch(`${GAMMA_API}/events?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }
  
  return response.json();
}

// Gamma API - Tags/Categories
export async function getTags(): Promise<string[]> {
  const response = await fetch(`${GAMMA_API}/tags`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }
  
  return response.json();
}

// Data API - User Positions
export async function getUserPositions(userAddress: string): Promise<UserPosition[]> {
  const response = await fetch(`${DATA_API}/positions?user=${userAddress}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user positions: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Transform to our format
  return data.map((pos: any) => ({
    marketId: pos.marketId || pos.conditionId,
    conditionId: pos.conditionId,
    question: pos.question || pos.title || 'Unknown Market',
    outcome: pos.outcome || 'Yes',
    size: parseFloat(pos.size || pos.amount || 0),
    avgPrice: parseFloat(pos.avgPrice || pos.price || 0),
    currentPrice: parseFloat(pos.currentPrice || 0),
    pnl: parseFloat(pos.pnl || 0),
    pnlPercent: parseFloat(pos.pnlPercent || 0),
    value: parseFloat(pos.value || pos.size * pos.currentPrice || 0),
  }));
}

// Data API - User Trades
export async function getUserTrades(userAddress: string, limit = 50): Promise<MarketTrade[]> {
  const response = await fetch(`${DATA_API}/trades?user=${userAddress}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user trades: ${response.statusText}`);
  }
  
  return response.json();
}

// CLOB API - Price History
export async function getPriceHistory(
  conditionId: string,
  params?: {
    interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
    startTs?: number;
    endTs?: number;
  }
): Promise<PriceHistoryPoint[]> {
  const queryParams = new URLSearchParams();
  queryParams.set('market', conditionId);
  
  if (params?.interval) queryParams.set('interval', params.interval);
  if (params?.startTs) queryParams.set('startTs', params.startTs.toString());
  if (params?.endTs) queryParams.set('endTs', params.endTs.toString());

  const response = await fetch(`${CLOB_API}/prices-history?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch price history: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.history || !Array.isArray(data.history)) {
    return [];
  }
  
  return data.history.map((point: any) => ({
    timestamp: point.timestamp || point.t,
    price: parseFloat(point.price || point.p || 0),
    volume: parseFloat(point.volume || point.v || 0),
  }));
}

// CLOB API - Order Book
export async function getOrderBook(tokenId: string): Promise<{
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
}> {
  const response = await fetch(`${CLOB_API}/book?token_id=${tokenId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch order book: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    bids: (data.bids || []).map((b: any) => ({ price: parseFloat(b.price), size: parseFloat(b.size) })),
    asks: (data.asks || []).map((a: any) => ({ price: parseFloat(a.price), size: parseFloat(a.size) })),
  };
}

// CLOB API - Midpoint Price
export async function getMidpoint(tokenId: string): Promise<number | null> {
  const response = await fetch(`${CLOB_API}/midpoint?token_id=${tokenId}`);
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return data.mid ? parseFloat(data.mid) : null;
}

// CLOB API - Spread
export async function getSpread(tokenId: string): Promise<{ bid: number; ask: number } | null> {
  const response = await fetch(`${CLOB_API}/spread?token_id=${tokenId}`);
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return {
    bid: parseFloat(data.bid || 0),
    ask: parseFloat(data.ask || 0),
  };
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
