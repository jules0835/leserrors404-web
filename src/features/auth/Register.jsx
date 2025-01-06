/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
"use client"

import logo from "@/assets/images/logo.webp"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import Button from "@/components/ui/Button"
import axios from "axios"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Register() {
  const [countries, setCountries] = useState([])
  const t = useTranslations("Auth.RegisterPage")
  const currentLocale = useLocale()
  const router = useRouter()
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required(t("firstNameRequired")),
    lastName: Yup.string().required(t("lastNameRequired")),
    company: Yup.string().required(t("companyRequired")),
    zipCode: Yup.string().required(t("postalCodeRequired")),
    city: Yup.string().required(t("cityRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    password: Yup.string()
      .min(6, t("passwordMinLength"))
      .required(t("passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordsMustMatch"))
      .required(t("confirmPasswordRequired")),
    terms: Yup.bool().oneOf([true], t("termsRequired")),
    country: Yup.string().required(t("countryRequired")),
    phone: Yup.number().required(t("phoneRequired")),
  })
  const howDidYouHearOptions = [
    { name: "friend", code: 1, nameTrad: t("friend") },
    { name: "advertisement", code: 2, nameTrad: t("advertisement") },
    { name: "socialMedia", code: 3, nameTrad: t("socialMedia") },
    { name: "other", code: 4, nameTrad: t("other") },
  ]

  useEffect(() => {
    axios.get("api/public/countries").then((response) => {
      const sortedCountries = response.data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      )
      setCountries(sortedCountries)
    })
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0 bg-[#2F1F80]">
        <Link
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          href="/"
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

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                company: "",
                zipCode: "",
                city: "",
                country: "",
                email: "",
                password: "",
                confirmPassword: "",
                terms: false,
                phone: "",
                title: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await axios
                  .post("/api/auth/register", values)
                  .then(() => {
                    setSubmitting(false)
                    router.push(`${currentLocale}/auth/login`)
                  })
                  .catch(() => {
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

                      <div className="flex  md:space-x-4 space-x-2">
                        <div className="w-full">
                          <label
                            htmlFor="zipCode"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("postalCode")}
                          </label>
                          <Field
                            type="text"
                            name="zipCode"
                            id="zipCode"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Postal Code"
                          />
                          <ErrorMessage
                            name="zipCode"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>

                        <div className="w-full">
                          <label
                            htmlFor="city"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            {t("city")}
                          </label>
                          <Field
                            type="text"
                            name="city"
                            id="city"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="City"
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="country"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          {t("country")}
                        </label>
                        <Field
                          as="select"
                          name="country"
                          id="country"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        >
                          <option value="">{t("selectCountry")}</option>
                          {countries?.map((country) => (
                            <option key={country.id} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="country"
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
                        <PhoneInput
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 width-auto"
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

                    <Button
                      type="submit"
                      isMain
                      isSubmit
                      isLoading={isSubmitting}
                    >
                      {t("register")}
                    </Button>

                    <p className="text-sm font-light text-gray-500 mt-5">
                      {t("alreadyRegistered")}{" "}
                      <Link
                        href="/auth/login"
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
