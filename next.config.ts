import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Genkit runs only on the server. Loading it from node_modules at runtime instead of bundling it
  // avoids webpack resolving optional requires deep in its tree, e.g. '@opentelemetry/exporter-jaeger'
  // inside @opentelemetry/sdk-node ("Module not found" on Vercel builds).
  serverExternalPackages: ['genkit', '@genkit-ai/googleai'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
