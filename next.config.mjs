import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false

    return config
  },
  images: {
    domains: [
      "fimkppvxvt92ijit.public.blob.vercel-storage.com",
      "upload.wikimedia.org",
    ],
  },
}

export default withNextIntl(nextConfig)
