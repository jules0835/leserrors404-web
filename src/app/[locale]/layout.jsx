import Header from "@/features/navigation/header/Header"
import "../../styles/globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Cyna",
  description: "Web App For Cyna",
}

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
