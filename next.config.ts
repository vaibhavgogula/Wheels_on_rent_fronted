import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8080',
      },
    ],
  },
  // ❌ REMOVE THIS: allowedDevOrigins is invalid
  // devIndicators: {
  //   allowedDevOrigins: ['https://*.cloudworkstations.dev'],
  // },
};

export default nextConfig;
