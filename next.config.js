/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable full static export for SSG
  output: 'export',
  images: {
    // Not using next/image, but keep safe for future usage with static export
    unoptimized: true,
  },
};

module.exports = nextConfig;
