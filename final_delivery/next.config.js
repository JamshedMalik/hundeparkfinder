/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Add any image domains you need to use
  },
  // Ensure output is optimized for production
  output: 'standalone',
  // Add any environment variables you need to expose to the browser
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://hundeparkfinder.de',
  },
};

module.exports = nextConfig;
