/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // <=== enables static exports
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['127.0.0.1'],

};

export default nextConfig;
