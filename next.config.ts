import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "typeorm",
      "better-sqlite3",
      "reflect-metadata",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin: any) => {
          if (plugin.constructor.name === "TerserPlugin") {
            plugin.options.minimizer.options.keep_classnames = true;
            plugin.options.minimizer.options.keep_fnames = true;
          }
          return plugin;
        },
      );
    }
    return config;
  },
};

export default nextConfig;
