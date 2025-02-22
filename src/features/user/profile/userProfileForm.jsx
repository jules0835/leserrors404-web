"use client"
import { useEffect, useState, useRef } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getEditUserSchema } from "@/features/auth/utils/userValidation"
import { getHowDidYouHearOptions } from "@/features/auth/utils/register"
import { useTranslations } from "next-intl"
import toast from "react-hot-toast"
import axios from "axios"

export function UserProfileForm({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUser, setNewUser] = useState(user)
  const [errorMessage, setErrorMessage] = useState("")
  const t = useTranslations("User.Profile")
  const howDidYouHearOptions = getHowDidYouHearOptions(t)
  const validationSchema = getEditUserSchema(t)
  const formikRef = useRef()
  const [countries, setCountries] = useState([])
  const onSubmit = async (data, { setSubmitting }) => {
    try {
      const response = await toast.promise(
        axios.put("/api/user/dashboard/profile", data),
        {
          loading: t("saving"),
          success: t("saved"),
          error: t("error"),
        }
      )

      if (response) {
        setNewUser(response.data)
        setIsEditing(false)
        setErrorMessage("")
      }

      setSubmitting(false)

      setNewUser(response.data)

      return response
    } catch (error) {
      setErrorMessage(error.response?.data?.message || t("error"))
      setSubmitting(false)

      return { error: error.response?.data?.message || t("error") }
    }
  }
  const cancelEdit = () => {
    setIsEditing(false)

    if (formikRef.current) {
      formikRef.current.resetForm({ values: newUser })
    }
  }

  useEffect(() => {
    axios.get("/api/public/countries").then((response) => {
      setCountries(response.data || [{ name: "Error", id: 1 }])
    })
  }, [])

  return (
    <div>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      <Formik
        initialValues={newUser}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        innerRef={formikRef}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Field
                  id="firstName"
                  name="firstName"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="firstName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Field
                  id="lastName"
                  name="lastName"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="lastName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("phone")}</Label>
                <Field
                  id="phone"
                  name="phone"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="howDidYouHear">{t("howDidYouHear")}</Label>
                <Field
                  as="select"
                  id="howDidYouHear"
                  name="howDidYouHear"
                  disabled={!isEditing}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">{t("nothingSelected")}</option>
                  {howDidYouHearOptions.map((option) => (
                    <option key={option.code} value={option.name}>
                      {option.nameTrad}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="howDidYouHear"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">{t("country")}</Label>
                <Field
                  as="select"
                  id="country"
                  name="address.country"
                  disabled={!isEditing}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">{t("nothingSelected")}</option>
                  {countries?.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="address.country"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">{t("city")}</Label>
                <Field
                  id="city"
                  name="address.city"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="address.city"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">{t("zipCode")}</Label>
                <Field
                  id="zipCode"
                  name="address.zipCode"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="address.zipCode"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="street">{t("street")}</Label>
                <Field
                  id="street"
                  name="address.street"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="address.street"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company">{t("company")}</Label>
                <Field
                  id="company"
                  name="company"
                  as={Input}
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="company"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isSubmitting}>
                  {t("saveChanges")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => cancelEdit()}
                >
                  {t("cancel")}
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
      {!isEditing && (
        <div className="flex justify-end space-x-4 mt-8">
          <Button type="button" onClick={() => setIsEditing(true)}>
            {t("edit")}
          </Button>
        </div>
      )}
    </div>
  )
}
