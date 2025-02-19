import React from "react"
import { Img, Section, Text } from "@react-email/components"
import { getTranslations } from "next-intl/server"
import { company, webAppSettings } from "@/assets/options/config"

export default async function TopTemplate({ locale, userName }) {
  const t = await getTranslations({ locale, namespace: "Email" })

  return (
    <Section
      style={{
        backgroundColor: "#f3f4f6",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Img
        src={webAppSettings.images.logoNoTextUrl}
        alt="Company Logo"
        style={{ margin: "0 auto 16px", height: "96px", width: "auto" }}
      />
      <Text style={{ fontSize: "3rem", fontWeight: "bold" }}>
        {company.name}
      </Text>
      <Text
        style={{ fontSize: "1.25rem", fontWeight: "bold", paddingTop: "23px" }}
      >
        {userName
          ? t("greetingWithName", { userName })
          : t("greetingWithoutName")}
      </Text>
    </Section>
  )
}
