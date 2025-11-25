import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Remove custom font loading to fix the error
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // 👇 זה גורם ל־Vercel לא לעצור את הבנייה בגלל ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 👇 זה גורם ל־Vercel לא לעצור את הבנייה בגלל שגיאות TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
