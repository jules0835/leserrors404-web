import * as Yup from "yup"

export const getRegisterSchema = (t) =>
  Yup.object().shape({
    firstName: Yup.string().required(t("firstNameRequired")),
    lastName: Yup.string().required(t("lastNameRequired")),
    company: Yup.string().required(t("companyRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    password: Yup.string()
      .min(6, t("passwordMinLength"))
      .required(t("passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordsMustMatch"))
      .required(t("confirmPasswordRequired")),
    terms: Yup.bool().oneOf([true], t("termsRequired")),
    phone: Yup.number().required(t("phoneRequired")),
    address: Yup.object().shape({
      country: Yup.string().required(t("countryRequired")),
      city: Yup.string().required(t("cityRequired")),
      zipCode: Yup.string().required(t("postalCodeRequired")),
      street: Yup.string().required(t("streetRequired")),
    }),
  })

export const getEditUserSchema = (t) =>
  Yup.object().shape({
    firstName: Yup.string().required(t("firstNameRequired")),
    lastName: Yup.string().required(t("lastNameRequired")),
    company: Yup.string().required(t("companyRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    terms: Yup.bool().oneOf([true], t("termsRequired")),
    phone: Yup.number().required(t("phoneRequired")),
    address: Yup.object().shape({
      country: Yup.string().required(t("countryRequired")),
      city: Yup.string().required(t("cityRequired")),
      zipCode: Yup.string().required(t("postalCodeRequired")),
      street: Yup.string().required(t("streetRequired")),
    }),
    isActive: Yup.bool().required(t("isActiveRequired")),
    isEmployee: Yup.bool().required(t("isEmployeeRequired")),
    isAdmin: Yup.bool().required(t("isAdminRequired")),
    isConfirmed: Yup.bool().required(t("isConfirmedRequired")),
  })
