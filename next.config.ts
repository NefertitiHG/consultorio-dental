import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Se deshabilita en dev para no saturar con SW
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {}, // Solución para el plugin next-pwa con Next.js 16+ Turbopack
};

export default withPWA(nextConfig);
