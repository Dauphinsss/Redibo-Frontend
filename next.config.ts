/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'image.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-datak.motork.net',
      },
      {
        protocol: 'https',
        hostname: 'vivolabs.es',
      },
      {
        protocol: "https",
        hostname: '"lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.topgear.com'
      }
    ],
  }
};

export default nextConfig;
