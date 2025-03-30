/* eslint-disable max-params */
import { company } from "@/assets/options/config"
import ChatMessageEmail from "@/features/email/templates/chatMessageTemplate"
import { EmailTemplate } from "@/features/email/templates/main/emailTemplate"
import { sendEmail } from "@/features/email/utils/emailService"
import { getTranslations } from "next-intl/server"

export const sendAdminMessageEmail = async (
  chatId,
  email,
  userName,
  message,
  senderId,
  locale = "en"
) => {
  const t = await getTranslations({ locale, namespace: "Email" })
  await sendEmail({
    to: email,
    subject: t("Support.newMessageSubject", { company: company.name }),
    messageBody: (
      <EmailTemplate
        senderId={senderId || null}
        subject={t("Support.newMessageSubject", { company: company.name })}
        userName={userName}
      >
        <ChatMessageEmail
          chatId={chatId}
          newMessage={message}
          locale={locale}
        />
      </EmailTemplate>
    ),
  })
}
