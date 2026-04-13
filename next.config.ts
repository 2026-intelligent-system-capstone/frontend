import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	experimental: {
		optimizePackageImports: ['@heroui/react', '@heroui/styles'],
	},
};

export default nextConfig;
