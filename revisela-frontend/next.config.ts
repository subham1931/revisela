import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: [
      'revisela-storage-bucket.s3.ap-southeast-2.amazonaws.com',
      'www.freepik.com',
      'www.example.com',
      'example.com',
      'localhost',
      '127.0.0.1'
    ],
  },
};

export default nextConfig;
