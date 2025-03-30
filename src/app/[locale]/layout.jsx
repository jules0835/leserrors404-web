import Header from "@/features/navigation/header/Header"
import "../../styles/globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "@/features/shop/cart/context/cartContext"
import WidgetChatbot from "@/features/contact/chatbot/widgetChatbot"
import { ChatProvider } from "@/features/contact/chatbot/context/chatContext"

export const metadata = {
  title: "Cyna",
  description: "Web App For Cyna",
  icons: {
    icon: "/public/favicon.ico",
  },
}

export default async function RootLayout({ children }) {
  const messages = await getMessages()

  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages}>
        <ChatProvider>
          <CartProvider>
            <div>
              <Toaster position="top-right" />
            </div>
            <Header />
            <div className="bg-gray-100">{children}</div>
          </CartProvider>
          <WidgetChatbot />
        </ChatProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
