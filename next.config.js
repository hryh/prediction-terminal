/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'polymarket.com'],
    unoptimized: true,
  },
  // Use serverless output for API routes support (required for Vercel)
  // For static export, use: output: 'export'
  output: 'standalone',
  distDir: '.next',
}

module.exports = nextConfig
