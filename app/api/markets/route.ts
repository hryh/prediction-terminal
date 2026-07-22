import { NextRequest, NextResponse } from 'next/server'

const GAMMA_API = 'https://gamma-api.polymarket.com'
const UPSTREAM_TIMEOUT_MS = 10000

function timeoutAfter(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  })
}

function normalizeMarket(market: any) {
  let prices: number[] = []

  if (Array.isArray(market.outcomePrices)) {
    prices = market.outcomePrices.map((p: string) => parseFloat(p) || 0)
  } else if (typeof market.outcomePrices === 'string') {
    try {
      const parsed = JSON.parse(market.outcomePrices)
      prices = Array.isArray(parsed) ? parsed.map((p: string) => parseFloat(p)) || 0 : []
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
  try {
    // Build minimal query - only send 'active=true'
    const url = new URL(request.url)
    const testUrl = `${GAMMA_API}/markets?active=true&limit=100`
    
    console.log('TEST_URL:', testUrl)

    const response = await Promise.race([
      fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
      timeoutAfter(UPSTREAM_TIMEOUT_MS),
    ])

    console.log('RESPONSE_STATUS:', response.status)

    if (!response.ok) {
      const body = await response.text()
      console.log('ERROR_RESPONSE:', body)
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('SUCCESS_MARKETS_COUNT:', data.length)

    if (!Array.isArray(data)) {
      throw new Error('Not an array')
    }

    const markets = data.map(normalizeMarket)

    return NextResponse.json(markets, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error: any) {
    console.log('FINAL_ERROR:', error?.message || String(error))
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    )
  }
}
