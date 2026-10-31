import type { NextConfig } from 'next';

const allowOrigin = process.env.CORS_ALLOWED_ORIGIN ?? '*';

const nextConfig: NextConfig = {
  // Docker builds set NEXT_STANDALONE=1 to produce a self-contained server bundle.
  output: process.env.NEXT_STANDALONE ? 'standalone' : undefined,
  // catalog.json is read at runtime from disk; make sure it ships with the standalone build
  outputFileTracingIncludes: { '/api/**/*': ['./data/catalog.json'] },
  serverExternalPackages: ['pg'],
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: allowOrigin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
          { key: 'Access-Control-Max-Age', value: '3600' },
        ],
      },
    ];
  },
};

export default nextConfig;
