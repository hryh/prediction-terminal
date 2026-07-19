import { NextResponse } from 'next/server'

const GAMMA_API = 'https://gamma-api.polymarket.com'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  try {
    const response = await fetch(`${GAMMA_API}/markets/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 },
    })
    
    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse outcome prices
    let prices: number[] = []
    if (Array.isArray(data.outcomePrices)) {
      prices = data.outcomePrices.map((p: string) => parseFloat(p) || 0)
    }
    
    return NextResponse.json({
      ...data,
      outcomePricesNum: prices,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Error fetching market:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market' },
      { status: 500 }
    )
  }
}
