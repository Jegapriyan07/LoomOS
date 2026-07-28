import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@neondatabase/serverless",
    "@prisma/adapter-neon",
    "ws",
  ],
};

export default nextConfig;
