"use client"

import ChatBox from "@/features/contact/chatbot/chatBox"

export default function ContactPage() {
  return (
    <div className="container mx-auto md:px-28 md:py-8 md:pt-20 h-screen justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ChatBox />
      </div>
    </div>
  )
}
