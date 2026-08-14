import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
      {
        protocol: "https",
        hostname: "wjwyfevdyxsgyyotzdgh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
