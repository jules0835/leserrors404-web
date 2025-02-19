import React from "react"
import { Button, Section, Text } from "@react-email/components"
import { getTranslations } from "next-intl/server"

export default async function ConfirmTemplate({ locale = "en", confirmUrl }) {
  const t = await getTranslations({ locale, namespace: "Email" })

  return (
    <Section
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "1.125rem" }}>{t("confirmEmailMessage")}</Text>
      <Button
        href={confirmUrl}
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "8px 16px",
          borderRadius: "4px",
        }}
      >
        {t("confirmButton")}
      </Button>
    </Section>
  )
}
