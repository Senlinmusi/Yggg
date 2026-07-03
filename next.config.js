/** @type {import('next').NextConfig} */
const nextConfig = {
  // 必须关闭 SWC，确保编译过程使用最简单的转换
  swcMinify: false,
  // 彻底关闭并行构建，确保在单核环境下平稳运行
  experimental: {
    webpackBuildWorker: false,
  },
  // 禁用所有可能触发高内存消耗的设置
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = nextConfig

