import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set the base path for GitHub Pages
  basePath: isProd ? '/ada-2025-data-dinosaur-website' : '',
  // Optional: Asset prefix is usually handled by basePath, but can be explicit if needed
  assetPrefix: isProd ? '/ada-2025-data-dinosaur-website' : '',
  // reactCompiler: true,
};

export default nextConfig;
