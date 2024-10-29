/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shows logs of API calls made during development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // reactStrictMode: false,
};

export default nextConfig;
