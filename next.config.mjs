/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint config removed; handled by separate .eslintrc file if needed
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
