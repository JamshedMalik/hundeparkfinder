/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add any image domains you need to use
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://hundeparkfinder.de',
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevent ESLint errors from breaking Vercel builds
  },
};

module.exports = nextConfig;
