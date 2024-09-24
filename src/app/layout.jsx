import "../styles/globals.css"

export const metadata = {
  title: "Cyna",
  description: "Web App For Cyna",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
