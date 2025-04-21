/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
"use client"

import logo from "@/assets/images/logo.webp"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Formik, Form, Field, ErrorMessage } from "formik"
import DButton from "@/components/ui/DButton"
import axios from "axios"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useEffect, useState } from "react"
import { getRegisterSchema } from "@/features/auth/utils/userValidation"
import { getHowDidYouHearOptions } from "@/features/auth/utils/register"
import { useSearchParams } from "next/navigation"
import { useTitle } from "@/components/navigation/titleContext"
import { MailCheck } from "lucide-react"

export default function Register() {
  const [countries, setCountries] = useState([{ name: "Loading", id: 1 }])
  const [ErrorRegisterMessage, setErrorRegisterMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const t = useTranslations("Auth.RegisterPage")
  const currentLocale = useLocale()
  const validationSchema = getRegisterSchema(t)
  const howDidYouHearOptions = getHowDidYouHearOptions(t)
  const redirectUrl = searchParams.get("next") || "/"
  const isAppMobileLogin = searchParams.get("appMobileLogin") === "true"
  const { setTitle } = useTitle()
  setTitle(t("title"))

  useEffect(() => {
    axios.get("/api/public/countries").then((response) => {
      setCountries(response.data || [{ name: "Error", id: 1 }])
    })
  }, [])

  if (success) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen bg-[#2F1F80]">
          <Link
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
            href={isAppMobileLogin ? "#" : redirectUrl}
          >
            <div className="p-4 rounded-2xl">
              <Image src={logo} alt="logo" width={132} height={132} />
            </div>
          </Link>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-3xl xl:max-w-4xl xl:p-0">
            <div className=" sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                {t("title")}
              </h1>
              <div className="flex flex-col space-y-5 items-center justify-center text-center w-full h-96">
                <MailCheck size={48} />

                <h1 className="text-3xl font-bold text-gray-900">
                  {t("successMessage")}
                </h1>
                <p>{t("successMessage2")} </p>
                <p>{t("successMessage3")}</p>
                <p>{t("successMessage4")}</p>
              </div>
              <Link href="/auth/login">
                <DButton isMain>{t("login")}</DButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen bg-[#2F1F80]">
        <Link
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          href={isAppMobileLogin ? "#" : redirectUrl}
        >
          <div className="p-4 rounded-2xl">
            <Image src={logo} alt="logo" width={132} height={132} />
          </div>
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-3xl xl:max-w-4xl">
          <div className="md:p-8 p-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              {t("title")}
            </h1>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                company: "",
                email: "",
                password: "",
                confirmPassword: "",
                terms: false,
                phone: "",
                title: 1,
                howDidYouHear: "friend",
                address: {
                  country: "",
                  city: "",
                  zipCode: "",
                  street: "",
                },
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await axios
                  .post(`/api/authentification/register`, values)
                  .then(() => {
                    setSubmitting(false)
                    setSuccess(true)
                  })
                  .catch(() => {
                    setErrorRegisterMessage(t("errorRegister"))
                    setSubmitting(false)
                  })
                setSubmitting(false)
              }}
            >
              {({ isSubmitting, ...formik }) => (
                <Form>
                  <div className="md:flex">
                    <div className="md:w-1/2 md:mr-8 space-y-3">
                      <div className="flex md:space-x-4 space-x-2 w-full">
                        <div className="w-52">
                          <label
                            htmlFor="title"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("titleName")}
                          </label>
                          <Field
                            as="select"
                            name="title"
                            id="title"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          >
                            <option value="1">{t("mrs")}</option>
                            <option value="2">{t("mr")}</option>
                            <option value="3">{t("unspecified")}</option>
                          </Field>
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor="firstName"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("firstName")}
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="First Name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="lastName"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("lastName")}
                        </label>
                        <Field
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="Last Name"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div className="flex  md:space-x-4 space-x-2">
                        <div className="w-full ">
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("company")}
                          </label>
                          <Field
                            type="text"
                            name="company"
                            id="company"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Company"
                          />
                          <ErrorMessage
                            name="company"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor="address.country"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("country")}
                          </label>
                          <Field
                            as="select"
                            name="address.country"
                            id="address.country"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            value={formik.values.address.country}
                          >
                            <option value="">{t("selectCountry")}</option>
                            {countries?.map((country) => (
                              <option key={country.id} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="address.country"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex  md:space-x-4 space-x-2">
                        <div className="w-full">
                          <label
                            htmlFor="address.zipCode"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("postalCode")}
                          </label>
                          <Field
                            type="text"
                            name="address.zipCode"
                            id="address.zipCode"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Postal Code"
                          />
                          <ErrorMessage
                            name="address.zipCode"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor="address.city"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("city")}
                          </label>
                          <Field
                            type="text"
                            name="address.city"
                            id="address.city"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="City"
                          />
                          <ErrorMessage
                            name="address.city"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="address.street"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("street")}
                        </label>
                        <Field
                          type="text"
                          name="address.street"
                          id="address.street"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="Street"
                        />
                        <ErrorMessage
                          name="address.street"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="md:w-1/2 space-y-3">
                      <div className="w-full">
                        <label
                          htmlFor="phone"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("phone")}
                        </label>
                        <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 width-auto">
                          <PhoneInput
                            defaultCountry={
                              currentLocale === "en"
                                ? "US"
                                : currentLocale.toUpperCase()
                            }
                            value={formik.values.phone}
                            onChange={(value) =>
                              formik.setFieldValue("phone", value || "")
                            }
                            placeholder={t("phone")}
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("email")}
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          placeholder="name@company.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("password")}
                        </label>
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="w-full">
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
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="howDidYouHear"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("howDidYouHear")}
                        </label>
                        <Field
                          as="select"
                          name="howDidYouHear"
                          id="howDidYouHear"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        >
                          {howDidYouHearOptions.map((option) => (
                            <option key={option.code} value={option.name}>
                              {option.nameTrad}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="howDidYouHear"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start mt-6">
                      <div className="flex items-center h-5">
                        <Field
                          type="checkbox"
                          name="terms"
                          id="terms"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="terms"
                          className="font-light text-gray-500"
                        >
                          {t("acceptTermsStart")}{" "}
                          <Link
                            href="/legals/terms-and-conditions"
                            className="font-medium text-primary-600 hover:underline"
                          >
                            {t("acceptTermsEnd")}
                          </Link>
                        </label>
                      </div>
                    </div>
                    <ErrorMessage
                      name="terms"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />

                    <h5 className="text-red-600 text-sm mt-1">
                      {ErrorRegisterMessage}
                    </h5>

                    <DButton
                      type="submit"
                      isMain
                      isSubmit
                      isLoading={isSubmitting}
                    >
                      {t("register")}
                    </DButton>

                    <p className="text-sm font-light text-gray-500 mt-5">
                      {t("alreadyRegistered")}{" "}
                      <Link
                        href={`/auth/login?next=${redirectUrl}&appMobileLogin=${isAppMobileLogin}`}
                        className="font-medium text-primary-600 hover:underline"
                      >
                        {t("login")}
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}
