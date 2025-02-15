import React from "react"
import { Section, Text } from "@react-email/components"
import { getTranslations } from "next-intl/server"
import { findUserEmailInfos } from "@/db/crud/userCrud"
import { company } from "@/assets/options/config"

export default async function BotTemplate({ locale, senderId }) {
  const t = await getTranslations({ locale, namespace: "Email" })
  const user = await findUserEmailInfos(senderId)

  return (
    <Section
      style={{
        backgroundColor: "#f3f4f6",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "1.125rem" }}>
        {user ? t("userMessage") : t("companyMessage")}
      </Text>
      <Text style={{ marginTop: "8px", fontWeight: "bold" }}>
        {user
          ? t("userSignature", {
              firstName: user.firstName,
              lastName: user.lastName,
            })
          : t("companySignature", { company: company.name })}
      </Text>
      <Text style={{ marginTop: "1px" }}>
        {user
          ? t("userEmail", { email: user.email })
          : t("companyEmail", { email: company.email })}
      </Text>
      <Text style={{ marginTop: "30px" }}>
        {t("noReplyEmail", { email: company.email })}
      </Text>
    </Section>
  )
}
