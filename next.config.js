/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Оптимизация изображений
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Экспериментальные фичи для производительности
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
};

module.exports = nextConfig;
