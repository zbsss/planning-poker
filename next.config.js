/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // example
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
