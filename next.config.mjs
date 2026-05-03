/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Serve WebP/AVIF to browsers that support it — smaller files = faster load
    formats: ['image/avif', 'image/webp'],
  },

  // Enable HTTP keep-alive for Supabase fetch connections
  // This avoids re-establishing TCP connections on every request
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Compress responses
  compress: true,

  // Aggressive static page generation
  output: 'standalone',
};

export default nextConfig;
