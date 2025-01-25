"use client"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import logo from "@/assets/images/logo.webp"
import { useTranslations } from "next-intl"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import DButton from "@/components/ui/DButton"
import { handleCredentialsSignin } from "@/utils/action/handleCredentialSignIn"
import { useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"

// eslint-disable-next-line max-lines-per-function
export default function Login() {
  const t = useTranslations("Auth.LoginPage")
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t("invalidEmail")).required(t("requiredEmail")),
    password: Yup.string()
      .min(12, t("passwordMinLength"))
      .required(t("requiredPassword")),
  })
  const redirect = searchParams.get("next") || "/"

  if (session) {
    router.push("/")
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <Link
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        href="/"
      >
        <div className="p-4 rounded-2xl">
          <Image src={logo} alt="logo" width={132} height={132} />
        </div>
      </Link>

      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            {t("title")}
          </h1>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              values.redirect = redirect
              const res = await handleCredentialsSignin(values)

              if (res.error) {
                setSubmitting(false)
              }
            }}
          >
            {/* eslint-disable-next-line max-lines-per-function */}
            {({ isSubmitting }) => (
              <Form className="space-y-4 md:space-y-6">
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
                    id="credentials-email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="name@company.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

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
                    id="credentials-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500">
                        {t("rememberMe")}
                      </label>
                    </div>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>

                <DButton isMain isSubmit isLoading={isSubmitting}>
                  {t("login")}
                </DButton>

                <p className="text-sm font-light text-gray-500">
                  {t("noAccount")}{" "}
                  <Link
                    className="font-medium text-primary-600 hover:underline"
                    href="/auth/register"
                  >
                    {t("register")}
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
