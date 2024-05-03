/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['themewagon.github.io'],
  },
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 5,
};

module.exports = nextConfig;
