/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'polymarket.com'],
    unoptimized: true,
  },
  // Static export for simple hosting
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
}

module.exports = nextConfig
