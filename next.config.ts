// next.config.js o next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname:'**.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: '**.freepik.com',
      },
      {
        protocol: 'https',
        hostname: '**.motork.net',
      }
    ]
  }

  
}

export default nextConfig;
