import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable type checking during dev for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during dev
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable React strict mode for better performance
  reactStrictMode: true,
};

export default nextConfig;
