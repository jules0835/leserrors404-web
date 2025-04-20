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
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LockKeyhole } from "lucide-react"
import { company } from "@/assets/options/config"
import { useTitle } from "@/components/navigation/titleContext"

// eslint-disable-next-line max-lines-per-function
export default function Login() {
  const [error, setError] = useState(null)
  const [otpOpen, setOtpOpen] = useState(false)
  const t = useTranslations("Auth.LoginPage")
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const otpInputRef = useRef(null)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t("invalidEmail")).required(t("requiredEmail")),
    password: Yup.string()
      .min(12, t("passwordMinLength"))
      .required(t("requiredPassword")),
    otp: Yup.string().when("otpRequired", {
      is: true,
      then: Yup.string().required(t("requiredOtp")),
    }),
  })
  const redirectUrl = searchParams.get("next") || "/"
  const isAppMobileLogin = searchParams.get("appMobileLogin")
  const isResetSuccess = searchParams.get("resetSuccess")
  const isLogout = searchParams.get("logout")
  const { setTitle } = useTitle()
  setTitle(t("title"))

  useEffect(() => {
    if (otpOpen && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [otpOpen])

  if (session && !isLogout) {
    if (!isAppMobileLogin) {
      router.push(redirectUrl)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <Link
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        href={isAppMobileLogin ? "#" : redirectUrl}
      >
        <div className="p-4 rounded-2xl">
          <Image src={logo} alt="logo" width={132} height={132} />
        </div>
      </Link>

      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            {isAppMobileLogin
              ? t("titleMobile", { company: company.name })
              : t("title", { company: company.name })}
          </h1>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">
              {error}
            </p>
          )}

          {isLogout && (
            <p className="text-red-600 text-sm font-medium text-center">
              {t("logoutAutoSuccess")}
            </p>
          )}

          {isResetSuccess && (
            <p className="text-green-600 text-sm font-medium text-center">
              {t("resetSuccess")}
            </p>
          )}

          <Formik
            initialValues={{
              email: "",
              password: "",
              otp: "",
              keepLogin: false,
              appMobileLogin: Boolean(isAppMobileLogin),
            }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              values.redirect = isAppMobileLogin
                ? `/auth/login/mobile?appMobileLogin=${isAppMobileLogin}`
                : redirectUrl

              const res = await handleCredentialsSignin(values)

              if (res.error) {
                setSubmitting(false)
                setError(res.error)
              } else if (res.otpRequired) {
                setOtpOpen(true)
                setError(null)
              } else {
                router.push(redirectUrl)
              }
            }}
          >
            {/* eslint-disable-next-line max-lines-per-function */}
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4 md:space-y-6">
                {otpOpen && (
                  <div className="space-y-2 items-center justify-center text-center w-full">
                    <div className="flex items-center justify-center mb-4">
                      <LockKeyhole size={48} />
                    </div>
                    <label
                      htmlFor="otp"
                      className="block mb-10 text-sm font-medium text-gray-900"
                    >
                      {t("otpRequired")}
                    </label>
                    <div className="flex items-center justify-center">
                      <Field name="otp">
                        {({ field }) => (
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={(value) => setFieldValue("otp", value)}
                            ref={otpInputRef}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        )}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                )}
                {!otpOpen && (
                  <div>
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

                    <div className="mt-2">
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

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <Field
                            type="checkbox"
                            name="keepLogin"
                            id="keepLogin"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="keepLogin" className="text-gray-500">
                            {t("rememberMe")}
                          </label>
                        </div>
                      </div>
                      <Link
                        href={`/auth/password?next=${redirectUrl}&appMobileLogin=${isAppMobileLogin}`}
                        className="text-sm font-medium text-primary-600 hover:underline"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>
                  </div>
                )}

                <DButton isMain isSubmit isLoading={isSubmitting}>
                  {t("login")}
                </DButton>

                <p className="text-sm font-light text-gray-500">
                  {t("noAccount")}{" "}
                  <Link
                    className="font-medium text-primary-600 hover:underline"
                    href={`/auth/register?next=${redirectUrl}&appMobileLogin=${isAppMobileLogin}`}
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
