import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  htmlLimitedBots: ".*",
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zvvdguxfiurikxizotkj.supabase.co",
      },
    ],
  },
};

export default nextConfig;
