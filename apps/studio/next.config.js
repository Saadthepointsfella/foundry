/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vibefoundry/core', '@vibefoundry/adapters', '@vibefoundry/packs-registry'],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
