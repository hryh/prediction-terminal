'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
  date: string
  price: number
  volume?: number
}

interface PriceChartProps {
  data: ChartDataPoint[]
  height?: number
  showVolume?: boolean
}

export default function PriceChart({ data, height = 300, showVolume = false }: PriceChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatPrice = (price: number) => {
    return `${(price * 100).toFixed(1)}%`
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatPrice}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 1]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-terminal-card border border-terminal-border rounded-lg p-3 shadow-xl">
                    <p className="text-xs text-terminal-muted mb-1">{formatDate(label)}</p>
                    <p className="text-lg font-bold terminal-text">
                      {formatPrice(payload[0].value as number)}
                    </p>
                    {showVolume && payload[0].payload.volume && (
                      <p className="text-xs text-terminal-muted mt-1">
                        Volume: ${(payload[0].payload.volume / 1e6).toFixed(2)}M
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
