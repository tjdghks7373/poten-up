import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
