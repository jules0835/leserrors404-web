/* eslint-disable camelcase */
export default function manifest() {
  return {
    name: "Cyna - Your Cybersecurity Partner",
    short_name: "Cyna",
    description: "Cyna - Your Cybersecurity Partner, in your pocket.",
    start_url: "/",
    display: "standalone",
    background_color: "#2F1F80",
    theme_color: "#2F1F80",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  }
}
