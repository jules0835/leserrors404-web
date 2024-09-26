import "../../styles/globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

export const metadata = {
  title: "Cyna",
  description: "Web App For Cyna",
}

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
