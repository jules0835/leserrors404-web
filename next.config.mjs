import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false

    return config
  },
  images: {
    // You need to add the domains you want to allow to be used as images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fimkppvxvt92ijit.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
