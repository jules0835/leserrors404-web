"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
export default function TopLevelLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body className="antialiased overscroll-none bg-[#2F1F80]">
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
