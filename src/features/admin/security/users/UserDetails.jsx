"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { webAppSettings } from "@/assets/options/config"
import { getEditUserSchema } from "@/utils/validation/user"
import { getHowDidYouHearOptions } from "@/features/auth/utils/register"
import { useTranslations } from "next-intl"
import axios from "axios"
import toast from "react-hot-toast"

export function UserDetailsForm({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUser, setNewUser] = useState(user)
  const t = useTranslations("Admin.Security.Users.UserDetails")
  const howDidYouHearOptions = getHowDidYouHearOptions(t)
  const validationSchema = getEditUserSchema(t)
  const formikRef = useRef()
  const [countries, setCountries] = useState([])
  const onSubmit = async (data, { setSubmitting }) => {
    const response = await toast.promise(
      axios.put(`/api/admin/security/users/${data._id}`, data),
      {
        loading: t("savingChanges"),
        success: t("changesSavedSuccessfully"),
        error: t("failedToSaveChanges"),
      }
    )

    if (response.error) {
      return
    }

    setNewUser(response.data.user)
    console.log(response.data.user)
    setIsEditing(false)
    setSubmitting(false)
  }
  const cancelEdit = () => {
    setIsEditing(false)
    if (formikRef.current) {
      formikRef.current.resetForm({ values: newUser }) // Réinitialiser le formulaire
    }
  }

  useEffect(() => {
    axios.get("/api/public/countries").then((response) => {
      setCountries(response.data || [{ name: "Error", id: 1 }])
    })
  }, [])

  return (
    <div>
      <Formik
        initialValues={newUser}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        innerRef={formikRef}
      >
        {({ isSubmitting, values, setFieldValue, ...formik }) => (
          <Form className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={user.profilePicture || webAppSettings.images.userDefault}
                  alt={t("profilePictureAlt", {
                    firstName: user.firstName,
                    lastName: user.lastName,
                  })}
                  width={150}
                  height={150}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
                  <p className="text-sm text-gray-500">
                    {t("created", {
                      date: new Date(user.createdAt).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center space-y-4">
                  <Label htmlFor="isActive">{t("active")}</Label>
                  <Switch
                    id="isActive"
                    checked={values.isActive}
                    onCheckedChange={() =>
                      setFieldValue("isActive", !values.isActive)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Label htmlFor="isEmployee">{t("employee")}</Label>
                  <Switch
                    id="isEmployee"
                    checked={values.isEmployee}
                    onCheckedChange={() =>
                      setFieldValue("isEmployee", !values.isEmployee)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Label htmlFor="isAdmin">{t("admin")}</Label>
                  <Switch
                    id="isAdmin"
                    checked={values.isAdmin}
                    onCheckedChange={() =>
                      setFieldValue("isAdmin", !values.isAdmin)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <Label htmlFor="isConfirmed">{t("confirmed")}</Label>
                  <Switch
                    id="isConfirmed"
                    checked={values.isConfirmed}
                    onCheckedChange={() =>
                      setFieldValue("isConfirmed", !values.isConfirmed)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

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
