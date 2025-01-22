import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false

    return config
  },
}

export default withNextIntl(nextConfig)
