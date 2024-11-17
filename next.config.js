/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  swcMinify: true
}

module.exports = nextConfig
