import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  images: {
    // domains: ["aaronsblob123.blob.core.windows.net"]
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aaronsblob123.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sheargeniusblob.blob.core.windows.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;