import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export for DreamHost
  output: "export",

  // Disable image optimization for static export (use unoptimized images)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
    ],
  },

  // No trailing slashes - handled by .htaccess
  trailingSlash: false,

  // Typed routes disabled for static export compatibility
  // typedRoutes: true,
};

export default nextConfig;
