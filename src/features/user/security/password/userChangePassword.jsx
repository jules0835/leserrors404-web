"use client"
import { useState } from "react"
import axios from "axios"
import { useTranslations } from "next-intl"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

export default function UserChangePassword() {
  const t = useTranslations("User.Security.Password")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(t("currentPasswordRequired")),
    newPassword: Yup.string()
      .min(12, t("passwordMinLength"))
      .required(t("newPasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("passwordsMustMatch"))
      .required(t("confirmPasswordRequired")),
  })

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-md font-bold mb-4">{t("title")}</h2>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          toast
            .promise(
              axios.post("/api/user/dashboard/security/password", values),
              {
                loading: t("loading"),
                success: t("passwordChangeSuccess"),
                error: t("passwordChangeError"),
              }
            )
            .then(() => {
              setSuccessMessage(t("passwordChangeSuccess"))
              setErrorMessage("")
              resetForm()
            })
            .catch((error) => {
              setErrorMessage(error.response.data.error)
              setSuccessMessage("")
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("currentPassword")}
              </label>
              <Field
                type="password"
                name="currentPassword"
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("newPassword")}
              </label>
              <Field
                type="password"
                name="newPassword"
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                {t("confirmPassword")}
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>
            {successMessage && (
              <div className="text-green-600">{successMessage}</div>
            )}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              {t("changePassword")}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
