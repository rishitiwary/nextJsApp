/** @type {import('next').NextConfig} */

const nextConfig = {
  images:{
  domains:["media.grozep.com"]
  },

  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  typescript: {
    ignoreBuildErrors: true, // This will allow the build to complete even with TypeScript errors
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  swcMinify: false,
};

module.exports = nextConfig;
