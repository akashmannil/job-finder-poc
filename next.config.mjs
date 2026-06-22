/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint is not configured in this POC; type-safety is enforced via `tsc`.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
