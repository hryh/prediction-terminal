# Prediction Terminal - Deployment Guide

## Project Location
The project is saved at:
```
C:/Users/User/.kimi-code/bin/prediction-terminal/
```

## Features Implemented

### 1. Real Polymarket API Integration
- **Dashboard**: Displays trending markets and markets ending soon with live data
- **Markets Page**: Full market listing with search, filter, and sort functionality
- **Market Detail**: Individual market pages with price history charts
- **Portfolio**: Wallet address input to fetch real user positions from Polymarket

### API Endpoints Used
- **Gamma API**: `https://gamma-api.polymarket.com/markets` - Market data
- **Data API**: `https://data-api.polymarket.com/positions` - User positions
- **CLOB API**: `https://clob.polymarket.com/prices-history` - Price history

### 2. Pages with Real Data
| Page | Data Source | Features |
|------|-------------|----------|
| `/` (Dashboard) | Gamma API | Trending markets, ending soon, stats |
| `/markets` | Gamma API | Search, filter by category, sort by volume/liquidity |
| `/markets/[id]` | Gamma API + CLOB API | Market details, price history chart |
| `/portfolio` | Data API | Address input, positions, P&L tracking |

## How to Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to project directory**:
   ```bash
   cd "C:/Users/User/.kimi-code/bin/prediction-terminal"
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel

1. **Initialize Git repository** (if not already):
   ```bash
   cd "C:/Users/User/.kimi-code/bin/prediction-terminal"
   git init
   git add .
   git commit -m "Initial commit: Prediction Terminal with Polymarket API"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Name it `prediction-terminal`
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/prediction-terminal.git
   git branch -M main
   git push -u origin main
   ```

4. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `dist`
   - Click Deploy

### Option 3: Deploy to Vercel via Web Interface

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your repository
4. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click Deploy

## Configuration

The project is configured for static export in `next.config.js`:
```javascript
output: 'export',
distDir: 'dist',
trailingSlash: true,
```

This generates a static site in the `dist/` folder that can be deployed to any static hosting service.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve dist
```

## Environment Variables

No API keys are required for the Polymarket public APIs used in this project.

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Delete `.next/` and `dist/` folders
2. Run `npm install` again
3. Run `npm run build`

### API Rate Limits
The Polymarket APIs are public but may have rate limits. If you encounter rate limiting:
- Add delays between requests
- Implement caching
- Consider using a backend proxy

### Static Generation Note
The `/markets/[id]` pages are statically generated at build time with `generateStaticParams()`. This means:
- First load of a new market (not in the initial 100) will show the default page
- The client-side JavaScript will fetch the actual market data
- For production, consider implementing ISR (Incremental Static Regeneration)

## Next Steps / Improvements

1. **Add ISR**: For dynamic market pages to update without full rebuild
2. **Add WebSocket**: Real-time price updates via CLOB WebSocket API
3. **Add Authentication**: User login with wallet connection
4. **Add Caching**: Redis or similar for API response caching
5. **Add Error Boundaries**: Better error handling for API failures
