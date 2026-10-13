import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'i.namu.wiki',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  /**
   * 루트 경로는 콘텐츠 목록을 기본 진입 페이지로 사용
   * 추후 메인 페이지를 다시 도입할 수 있도록 영구 리다이렉트(308) 대신 임시 리다이렉트 사용
   */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/contents',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
