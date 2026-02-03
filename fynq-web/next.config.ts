import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrites for install script
  async rewrites() {
    return [
      {
        source: '/install',
        destination: '/install.sh',
      },
    ]
  },
  // Images from Supabase or generic avatars
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
