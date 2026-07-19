import { Metadata } from 'next'
import MarketDetailClient from './client'
import { getMarkets } from '@/lib/api'

// Generate static params for all markets at build time
export async function generateStaticParams() {
  try {
    const markets = await getMarkets({ limit: 100, active: true })
    return markets.map((market) => ({
      id: market.id,
    }))
  } catch {
    // Fallback to some default params if API fails
    return [{ id: 'default' }]
  }
}

export const metadata: Metadata = {
  title: 'Market Detail | Prediction Terminal',
  description: 'View detailed market data and price history',
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  return <MarketDetailClient marketId={params.id} />
}
