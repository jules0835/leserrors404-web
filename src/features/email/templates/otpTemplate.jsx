import React from "react"
import { Section, Text } from "@react-email/components"
import { getTranslations } from "next-intl/server"

export default async function OtpTemplate({ locale, code }) {
  const t = await getTranslations({ locale, namespace: "Email" })

  return (
    <Section
      style={{
        backgroundColor: "#ffffff",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "1.125rem" }}>{t("otpMessage1")}</Text>
      <Text style={{ fontSize: "1.125rem", marginTop: "25px" }}>
        {t("otpMessage2")}
      </Text>
      <Text
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginTop: "10px",
          border: "1px solid #000",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {code}
      </Text>
      <Text style={{ fontSize: "1rem", marginTop: "4px" }}>
        {t("otpMessageTiming")}
      </Text>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffcccb",
          padding: "10px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <Text style={{ fontSize: "1rem", color: "#d8000c" }}>
          {t("otpWarningMessage")}
        </Text>
      </div>
    </Section>
  )
}
