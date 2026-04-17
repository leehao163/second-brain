import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 如果需要静态导出，可开启 output: 'export'
  // output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
