import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/convert-from-:language',
        destination: '/convert-from/:language',
      },
      {
        source: '/convert-:pair',
        destination: '/convert/:pair',
      },
    ]
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
