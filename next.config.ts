import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typeorm", "better-sqlite3", "reflect-metadata"],
  turbopack: {},
};

export default nextConfig;
