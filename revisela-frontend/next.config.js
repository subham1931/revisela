/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    // Add any environment variables you want to expose to the browser here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
  domains: [
    'revisela-storage-bucket.s3.ap-southeast-2.amazonaws.com',
    'www.freepik.com','www.example.com'
  ],
},

  // Note: The server port is now set in package.json scripts
  // But we can also set it here alternatively
  // serverRuntimeConfig: {
  //   port: process.env.PORT || 4000
  // }
};

export default nextConfig;
