import React from "react"
import { Button, Section, Text } from "@react-email/components"
import { getTranslations } from "next-intl/server"
import { webAppSettings } from "@/assets/options/config"

export default async function ChatMessageEmail({
  locale = "en",
  newMessage,
  chatId,
}) {
  const t = await getTranslations({ locale, namespace: "Email" })
  const chatUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${webAppSettings.urls.supportChat}/${chatId}`

  return (
    <Section
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "1.125rem" }}>{t("Support.newMessage")}</Text>

      <Text
        style={{
          marginTop: "12px",
          marginBottom: "12px",
          color: "#374151",
          fontSize: "1rem",
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
          border: "1px solid #e5e7eb",
        }}
      >
        {newMessage}
      </Text>

      <Button
        href={chatUrl}
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "8px 16px",
          borderRadius: "4px",
        }}
      >
        {t("Support.openChatButton")}
      </Button>
    </Section>
  )
}
