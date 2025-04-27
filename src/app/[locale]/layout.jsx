import Header from "@/features/navigation/header/Header"
import "../../styles/globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "@/features/shop/cart/context/cartContext"
import WidgetChatbot from "@/features/contact/chatbot/widgetChatbot"
import { ChatProvider } from "@/features/contact/chatbot/context/chatContext"
import { TitleProvider } from "@/components/navigation/titleContext"
import { company } from "@/assets/options/config"
import Footer from "@/features/navigation/footer/footer"
import CookieBanner from "@/components/navigation/cookieBanner"
export const metadata = {
  title: company.name,
  description: `${company.name} | Web App`,
  icons: {
    icon: "/icon.png",
  },
}

export default async function RootLayout({ children }) {
  const messages = await getMessages()

  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages}>
        <TitleProvider>
          <ChatProvider>
            <CartProvider>
              <CookieBanner />
              <Toaster position="top-right" />
              <Header />
              <div className="bg-white">{children}</div>
              <Footer />
            </CartProvider>
            <WidgetChatbot />
          </ChatProvider>
        </TitleProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}
