import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.fairuzulum.me',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
