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
      .min(12, t("passwordMinLength"))
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
    phone: Yup.string().required(t("phoneRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    company: Yup.string().required(t("companyRequired")),
    createdAt: Yup.date().default(() => new Date()),
    isSuperAdmin: Yup.bool().default(false),
    isAdmin: Yup.bool().default(false),
    profilePicture: Yup.string(),
    howDidYouHear: Yup.string().required(t("howDidYouHearRequired")),
    address: Yup.object().shape({
      country: Yup.string().required(t("countryRequired")),
      city: Yup.string().required(t("cityRequired")),
      zipCode: Yup.string().required(t("postalCodeRequired")),
      street: Yup.string().required(t("streetRequired")),
    }),
    account: Yup.object().shape({
      confirmation: Yup.object().shape({
        isConfirmed: Yup.bool().default(false),
      }),
      activation: Yup.object().shape({
        isActivated: Yup.bool().default(true),
      }),
    }),
  })

export const getUserOrderEligibilitySchema = () =>
  Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    company: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.number().required(),
    address: Yup.object().shape({
      country: Yup.string().required(),
      city: Yup.string().required(),
      zipCode: Yup.string().required(),
      street: Yup.string().required(),
    }),
  })
