import { NextRequest, NextResponse } from 'next/server'

const GAMMA_API = 'https://gamma-api.polymarket.com'
const UPSTREAM_TIMEOUT_MS = 10000

function timeoutAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Gamma API timed out after ${ms}ms`)), ms)
  })
}

function normalizeMarket(market: any) {
  let prices: number[] = []

  if (Array.isArray(market.outcomePrices)) {
    prices = market.outcomePrices.map((p: string) => parseFloat(p) || 0)
  } else if (typeof market.outcomePrices === 'string') {
    try {
      const parsed = JSON.parse(market.outcomePrices)
      prices = Array.isArray(parsed) ? parsed.map((p: string) => parseFloat(p) || 0) : []
    } catch {
      prices = []
    }
  }

  return {
    ...market,
    liquidityNum: Number(market.liquidityNum || market.liquidity || 0),
    volumeNum: Number(market.volumeNum || market.volume || market.volumeClob || 0),
    volumeClob: Number(market.volumeClob || 0),
    outcomePricesNum: prices,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Forward all query params to Gamma API
  const gammaParams = new URLSearchParams()
  searchParams.forEach((value, key) => {
    gammaParams.set(key, value)
  })
  
  // Default params if not provided
  if (!gammaParams.has('active')) gammaParams.set('active', 'true')
  if (!gammaParams.has('limit')) gammaParams.set('limit', '100')
  
  try {
    const response = await Promise.race([
      fetch(`${GAMMA_API}/markets?${gammaParams.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }),
      timeoutAfter(UPSTREAM_TIMEOUT_MS),
    ])
    
    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Gamma API returned an unexpected response')
    }

    const markets = data.map(normalizeMarket)
    
    return NextResponse.json(markets, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Error fetching markets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    )
  }
}
