/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'polymarket.com'],
    unoptimized: true,
  },
  // Enable static export for Vercel
  output: 'export',
  distDir: 'dist',
  // Handle API routes in static export
  trailingSlash: true,
}

module.exports = nextConfig
