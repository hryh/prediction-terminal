# Prediction Terminal

AI-powered decision intelligence platform for prediction markets (Polymarket, Kalshi).

## Features

- **Dashboard** - Real-time market overview, trending markets, arbitrage opportunities
- **Markets** - Browse and filter prediction markets with real Polymarket data
- **Market Detail** - Live odds, historical charts, AI analysis, whale activity
- **Arbitrage Screener** - Cross-platform price comparison
- **AI News Intelligence** - AI-analyzed news with market impact
- **Event Calendar** - Track market-moving events
- **Portfolio** - Position tracking and P&L analysis (enter your wallet address)
- **Search** - AI-powered natural language search

## Tech Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- Recharts
- Polymarket API (Gamma, Data, CLOB)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
```

## Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```
