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
    // Serve WebP/AVIF — smaller files = faster load
    formats: ['image/avif', 'image/webp'],
  },

  // Compress all responses
  compress: true,

  // DO NOT use output: 'standalone' on Vercel — it breaks deployment
  // Vercel handles its own output format automatically
};

export default nextConfig;
