import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
