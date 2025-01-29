import Header from "@/features/navigation/header/Header"
import "../../styles/globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "Cyna",
  description: "Web App For Cyna",
}

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased overscroll-none bg-gray-100">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <div>
              <Toaster position="top-right" />
            </div>
            <Header />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
