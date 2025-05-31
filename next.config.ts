import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  include: './',
  ignore: ['node_modules', 'next.config.js'],
};
const nextConfig: NextConfig = withSentryConfig({
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				port: ''
			},
			{
				protocol: 'https',
				hostname: 'img.freepik.com',
				port: ''
			},
			{
				hostname: 'api.dicebear.com',
				protocol: 'https',
				port: ''
			}
		]
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			return config;
		}

		config.resolve.fallback = { fs: false, net: false, async_hooks: false };
		return config;
	}
}, sentryWebpackPluginOptions);

export default nextConfig;
	automaticVercelMonitors: true
});
