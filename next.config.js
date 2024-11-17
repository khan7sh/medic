/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
