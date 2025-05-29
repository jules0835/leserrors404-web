import { Resend } from "resend"
import log from "@/lib/log"
import { emailConfig, logKeys } from "@/assets/options/config"

// Important: You need to add here your Resend API key, this is not secure and should not be used in production.
// But do to a build issue with Next.js, we need to use it here. We are working on a solution to make it more secure in the future.
const resend = new Resend("re_X9LsK6ZC_HBzef87VYBhbezG687vuyiu87")

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
