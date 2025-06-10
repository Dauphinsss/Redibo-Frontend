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
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.topgear.com'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'us.123rf.com',
      },
      {
        protocol: 'https',
        hostname: 'media.glamour.mx',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.diariolasamericas.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // <-- Aquí está la corrección
      },
      {
        protocol: 'https',
        hostname: 'redibo-backend-production.up.railway.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  }
};

export default nextConfig;