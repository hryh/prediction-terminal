import { NextRequest, NextResponse } from 'next/server'

const GAMMA_API = 'https://gamma-api.polymarket.com'

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
    const response = await fetch(`${GAMMA_API}/markets?${gammaParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    })
    
    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse outcome prices from strings to numbers
    const markets = data.map((market: any) => {
      let prices: number[] = []
      if (Array.isArray(market.outcomePrices)) {
        prices = market.outcomePrices.map((p: string) => parseFloat(p) || 0)
      }
      return {
        ...market,
        outcomePricesNum: prices,
      }
    })
    
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
