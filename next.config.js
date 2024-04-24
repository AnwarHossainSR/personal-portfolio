/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['youtube.com'],
  },
  video: {
    domains: ['youtube.com'],
  },
};

module.exports = nextConfig;
