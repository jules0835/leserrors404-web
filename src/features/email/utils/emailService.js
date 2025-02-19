import { Resend } from "resend"
import log from "@/lib/log"
import { emailConfig, logKeys } from "@/assets/options/config"

const resend = new Resend(process.env.RESEND_EMAIL_SECRET)

export const sendEmail = async ({ from, to, subject, messageBody }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: from || emailConfig.noReplySender,
      to,
      subject,
      react: messageBody,
    })

    if (error) {
      log.systemError({
        logKey: logKeys.emailServiceError.key,
        message: "Failed to send email",
        isError: true,
        data: { from, to, subject, error },
      })
      throw new Error(error)
    }

    return data
  } catch (error) {
    throw new Error(error)
  }
}
