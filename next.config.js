/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Cesium.js configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle Cesium assets
    config.module = {
      ...config.module,
      unknownContextCritical: false,
    };

    return config;
  },
  // Enable static exports where possible
  output: 'standalone',

  // Environment variables available to the client
  env: {
    NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN: process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN || '',
  },
};

module.exports = nextConfig;
