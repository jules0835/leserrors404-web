"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useTranslations } from "next-intl"
import DButton from "@/components/ui/DButton"
import { resetPassword } from "@/features/auth/utils/passwordService"
import { useRouter } from "@/i18n/routing"

export default function ResetPassword({ token }) {
  const t = useTranslations("Auth.ResetPasswordPage")
  const [message, setMessage] = useState(null)
  const router = useRouter()
  const NewPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(12, t("passwordMinLength"))
      .required(t("requiredPassword")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordsMustMatch"))
      .required(t("requiredConfirmPassword")),
  })

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
        {t("title")}
      </h1>

      {message && (
        <p className="text-green-600 text-sm font-medium text-center">
          {message}
        </p>
      )}

      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={NewPasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await resetPassword(token, values.password)

          if (res.error) {
            setSubmitting(false)
            setMessage(res.message)

            return
          }

          router.push("/auth/login?resetSuccess=true")
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                {t("password")}
              </label>
              <Field
                type="password"
                name="password"
                id="new-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                {t("confirmPassword")}
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirm-password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <DButton isMain isSubmit isLoading={isSubmitting}>
              {t("resetPassword")}
            </DButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}
