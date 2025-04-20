"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { sendResetEmail } from "@/features/auth/utils/passwordService"
import { Link } from "@/i18n/routing"
import { webAppSettings } from "@/assets/options/config"
import Image from "next/image"
import { MailCheck } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTitle } from "@/components/navigation/titleContext"

export default function ResetPasswordPage() {
  const t = useTranslations("Auth.ResetPasswordPage")
  const [message, setMessage] = useState(null)
  const [emailSent, setEmailSent] = useState(false)
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("next") || "/"
  const isAppMobileLogin = searchParams.get("appMobileLogin")
  const ResetSchema = Yup.object().shape({
    email: Yup.string().email(t("invalidEmail")).required(t("requiredEmail")),
  })
  const { setTitle } = useTitle()
  setTitle(t("title"))

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <Link
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        href={isAppMobileLogin ? "#" : redirectUrl}
      >
        <div className="p-4 rounded-2xl">
          <Image
            src={webAppSettings.images.logoUrl}
            alt="logo"
            width={132}
            height={132}
          />
        </div>
      </Link>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            {t("title")}
          </h1>

          {message && !emailSent && (
            <p className="text-red-600 text-sm font-medium text-center">
              {message}
            </p>
          )}

          {!emailSent ? (
            <div>
              <p className="text-center">{t("description")}</p>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={ResetSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  const res = await sendResetEmail(values.email)

                  if (res.error) {
                    setMessage(res.message)
                    setSubmitting(false)

                    return
                  }

                  setSubmitting(false)
                  setMessage(res.message)
                  setEmailSent(true)
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4 md:space-y-6 mt-3">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        {t("email")}
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="reset-email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="name@company.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <DButton isMain isSubmit isLoading={isSubmitting}>
                      {t("sendEmail")}
                    </DButton>
                  </Form>
                )}
              </Formik>
              <p className="text-sm font-light text-gray-500 mt-4">
                {t("rememberYourPassword")}{" "}
                <Link
                  className="font-medium text-primary-600 hover:underline"
                  href={`/auth/login?next=${redirectUrl}&appMobileLogin=${isAppMobileLogin}`}
                >
                  {t("register")}
                </Link>
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center space-y-4">
              <MailCheck size={48} />

              <p className="text-green-600 text-sm font-medium text-center">
                {t("emailSent")}
              </p>

              <Link
                href={`/auth/login?next=${redirectUrl}&appMobileLogin=${isAppMobileLogin}`}
              >
                <DButton isMain>{t("goToLogin")}</DButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
