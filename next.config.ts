import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/localizador_de_produtos",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
