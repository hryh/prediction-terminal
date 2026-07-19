import { NextRequest, NextResponse } from 'next/server'

const DATA_API = 'https://data-api.polymarket.com'

export interface Position {
  marketId: string
  conditionId: string
  question: string
  outcome: string
  size: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  value: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userAddress = searchParams.get('user')
  
  if (!userAddress) {
    return NextResponse.json(
      { error: 'User address is required' },
      { status: 400 }
    )
  }
  
  try {
    const response = await fetch(`${DATA_API}/positions?user=${userAddress}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 10 }, // Shorter cache for positions
    })
    
    if (!response.ok) {
      // If API returns error, return mock data for demo
      return NextResponse.json(getMockPositions(userAddress))
    }
    
    const data = await response.json()
    
    // Transform and calculate PnL properly
    const positions: Position[] = data.map((pos: any) => {
      const size = parseFloat(pos.size || pos.amount || 0)
      const avgPrice = parseFloat(pos.avgPrice || pos.price || 0)
      const currentPrice = parseFloat(pos.currentPrice || 0)
      
      // PnL calculation:
      // For YES: profit if price goes up from avgPrice to currentPrice
      // For NO: profit if price goes down (we hold NO, so we win when YES prob decreases)
      const isNo = (pos.outcome || 'Yes').toLowerCase() === 'no'
      
      // For NO position: 
      // - Entry: we paid (1 - avgPrice) for the NO share
      // - Current value: (1 - currentPrice) for the NO share
      // - PnL = currentValue - entryValue = (1-currentPrice) - (1-avgPrice) = avgPrice - currentPrice
      // - But we express in terms of the position size
      
      let pnl: number
      let value: number
      let costBasis: number
      
      if (isNo) {
        // NO position
        const entryPrice = 1 - avgPrice  // What we paid per share
        const currentValue = 1 - currentPrice  // Current value per share
        pnl = (currentValue - entryPrice) * size
        value = currentValue * size
        costBasis = entryPrice * size
      } else {
        // YES position
        pnl = (currentPrice - avgPrice) * size
        value = currentPrice * size
        costBasis = avgPrice * size
      }
      
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0
      
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
      }
    })
    
    return NextResponse.json(positions, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching positions:', error)
    // Return mock data for demo when API fails
    return NextResponse.json(getMockPositions(userAddress))
  }
}

// Mock positions for demo when API is unavailable
function getMockPositions(userAddress: string): Position[] {
  // Deterministic mock based on address
  const seed = userAddress.slice(-4)
  const seedNum = parseInt(seed, 16) || 1
  
  return [
    {
      marketId: 'mock-1',
      conditionId: '0x1234...',
      question: 'Will Bitcoin hit $100k by end of 2024?',
      outcome: 'Yes',
      size: 500,
      avgPrice: 0.65,
      currentPrice: 0.78,
      pnl: (0.78 - 0.65) * 500,  // 65 profit
      pnlPercent: ((0.78 - 0.65) / 0.65) * 100,  // 20%
      value: 0.78 * 500,  // 390
    },
    {
      marketId: 'mock-2',
      conditionId: '0x5678...',
      question: 'Will Trump win the 2024 election?',
      outcome: 'No',
      size: 300,
      avgPrice: 0.40,  // YES was at 40%, so NO entry was 60%
      currentPrice: 0.35,  // YES now at 35%, so NO value is 65%
      // NO PnL: (currentNO - entryNO) * size = (0.65 - 0.60) * 300 = 15
      pnl: ((1 - 0.35) - (1 - 0.40)) * 300,
      pnlPercent: (((1 - 0.35) - (1 - 0.40)) / (1 - 0.40)) * 100,  // (0.05/0.60)*100 = 8.33%
      value: (1 - 0.35) * 300,  // 195
    },
    {
      marketId: 'mock-3',
      conditionId: '0x9abc...',
      question: 'Will ETH ETF be approved in 2024?',
      outcome: 'Yes',
      size: 200,
      avgPrice: 0.80,
      currentPrice: 0.72,
      pnl: (0.72 - 0.80) * 200,  // -16 loss
      pnlPercent: ((0.72 - 0.80) / 0.80) * 100,  // -10%
      value: 0.72 * 200,  // 144
    },
  ]
}
