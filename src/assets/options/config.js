import userDefault from "@/assets/images/user_default.png"
import {
  LayoutDashboard,
  MonitorCog,
  LockKeyhole,
  BriefcaseBusiness,
  Info,
  Bug,
  ShieldAlert,
  UserRoundX,
  UserRound,
} from "lucide-react"

export const company = {
  name: "Cyna",
  description: "Web App For Cyna",
  email: "contact@cyna.com",
}

export const emailConfig = {
  noReplySender: "Cyna B3 <no-reply@cyna-b3.machackhub.online>",
}

export const defaultProfile = {
  icon: userDefault,
}

export const webAppSettings = {
  urls: {
    home: "/",
    admin: "/admin",
    login: "/auth/login",
    register: "/auth/register",
    adminDashboard: "/admin",
    userProfile: "/user/dashboard/security/otp",
  },
  translation: {
    locales: ["en", "fr", "de", "ts"],
    titles: {
      en: "English",
      fr: "Français",
      de: "Deutsch",
      ts: "TEST LANGUAGE",
    },
    defaultLocale: "en",
  },
  salesfront: {
    homepage: {
      alertBannerId: "mainHomeAlertBanner",
      carouselId: "mainHomeCarousel",
    },
  },
  security: {
    user: {
      resendEmailDelayMinutes: 5,
      maxLoginAttemps: 5,
    },
  },
  images: {
    userDefault,
    logoNoTextUrl:
      "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1739652176726-JuJWTZdMoY5GaXGyjC8fmoYbP0r87H",
    logoUrl:
      "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1739651205443-vaV4qHCnghMEWuS7qETWhGd06LttXx",
  },
}

export const adminNavItems = [
  {
    title: "Dashboard",
    translationKey: "dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    isActive: true,
    isSuperAdmin: false,
    items: [],
  },
  {
    title: "Sales Front",
    translationKey: "salesFront",
    url: "#",
    icon: MonitorCog,
    isActive: true,
    isSuperAdmin: false,
    items: [
      {
        title: "Home Page",
        translationKey: "homePage",
        url: "/admin/salesfront/pages/home",
        isSuperAdmin: false,
      },
    ],
  },
  {
    title: "Business",
    translationKey: "business",
    url: "#",
    icon: BriefcaseBusiness,
    isActive: true,
    isSuperAdmin: false,
    items: [
      {
        title: "Products",
        translationKey: "products",
        url: "/admin/business/products",
        isSuperAdmin: false,
      },
      {
        title: "Categories",
        translationKey: "categories",
        url: "/admin/business/categories",
        isSuperAdmin: false,
      },
      {
        title: "Customers",
        translationKey: "customers",
        url: "/admin/business/customers",
        isSuperAdmin: false,
      },
      {
        title: "Orders",
        translationKey: "orders",
        url: "/admin/business/orders",
        isSuperAdmin: false,
      },
      {
        title: "Subscriptions",
        translationKey: "subscriptions",
        url: "/admin/business/subscriptions",
        isSuperAdmin: false,
      },
      {
        title: "Payments",
        translationKey: "payments",
        url: "/admin/business/payments",
        isSuperAdmin: false,
      },
      {
        title: "Coupons",
        translationKey: "coupons",
        url: "/admin/business/coupons",
        isSuperAdmin: false,
      },
    ],
  },
  {
    title: "Security",
    translationKey: "security",
    url: "#",
    icon: LockKeyhole,
    isActive: true,
    isSuperAdmin: false,
    items: [
      {
        title: "Users",
        translationKey: "users",
        url: "/admin/security/users",
        isSuperAdmin: false,
      },
      {
        title: "Logs",
        translationKey: "logs",
        url: "/admin/security/logs",
        isSuperAdmin: false,
      },
    ],
  },
]

export const userNavItems = [
  {
    title: "Dashboard",
    translationKey: "dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    isSuperAdmin: false,
    items: [],
  },
  {
    title: "My Account",
    translationKey: "myAccount",
    url: "/user#",
    icon: UserRound,
    isActive: true,
    isSuperAdmin: false,
    items: [
      {
        title: "Two Factor Auth",
        translationKey: "security",
        url: "/user/dashboard/security/otp",
        isSuperAdmin: false,
      },
    ],
  },
]
export const pagesNames = [
  {
    title: "Home Page",
    titleKey: "Admin.SalesFront.HomePage.title",
    subTitleKey: "Admin.SalesFront.HomePage.subTitle",
    url: "/admin/salesfront/pages/home",
  },
  {
    title: "Users Admin",
    titleKey: "Admin.Security.Users.title",
    subTitleKey: "Admin.Security.Users.subTitle",
    url: "/admin/security/users",
  },
  {
    title: "User details Admin",
    titleKey: "Admin.Security.Users.UserDetails.title",
    subTitleKey: "Admin.Security.Users.UserDetails.subTitle",
    url: "/admin/security/users/[Id]",
  },
  {
    title: "Logs admin",
    titleKey: "Admin.Security.Logs.title",
    subTitleKey: "Admin.Security.Logs.subTitle",
    url: "/admin/security/logs",
  },
  {
    title: "Log details admin",
    titleKey: "Admin.Security.Logs.LogDetails.title",
    subTitleKey: "Admin.Security.Logs.LogDetails.subTitle",
    url: "/admin/security/logs/[Id]",
  },
]

export const emptyCarouselPart = {
  titleTrans: {
    en: "No title",
  },
  descriptionTrans: {
    en: "No description",
  },
  image: "",
  link: "",
  isActive: false,
}

export const logKeys = {
  internalCriticalSecurity: {
    name: "Critical Security",
    key: "criticalSecurity",
    titleKey: "Log.CriticalSecurity.title",
    descriptionKey: "Log.CriticalSecurity.description",
  },
  internalError: {
    name: "Internal Error",
    key: "internalError",
    titleKey: "Log.InternalError.title",
    descriptionKey: "Log.InternalError.description",
  },
  settingsEdit: {
    name: "Settings Edit",
    key: "settingsEdit",
    titleKey: "Log.SettingsEdit.title",
    descriptionKey: "Log.SettingsEdit.description",
  },
  userConfirmation: {
    name: "User Confirmation",
    key: "userConfirmation",
    titleKey: "Log.UserConfirmation.title",
    descriptionKey: "Log.UserConfirmation.description",
  },
  newOrder: {
    name: "New Order",
    key: "newOrder",
    titleKey: "Log.NewOrder.title",
    descriptionKey: "Log.NewOrder.description",
  },
  loginAttempt: {
    name: "Login Attempt",
    key: "loginAttempt",
    titleKey: "Log.LoginAttempt.title",
    descriptionKey: "Log.LoginAttempt.description",
  },
  loginFailed: {
    name: "Login Failed",
    key: "loginFailed",
    titleKey: "Log.LoginFailed.title",
    descriptionKey: "Log.LoginFailed.description",
  },
  loginSuccess: {
    name: "Login Success",
    key: "loginSuccess",
    titleKey: "Log.LoginSuccess.title",
    descriptionKey: "Log.LoginSuccess.description",
  },
  registerAttempt: {
    name: "Register Attempt",
    key: "registerAttempt",
    titleKey: "Log.RegisterAttempt.title",
    descriptionKey: "Log.RegisterAttempt.description",
  },
  registerFailed: {
    name: "Register Failed",
    key: "registerFailed",
    titleKey: "Log.RegisterFailed.title",
    descriptionKey: "Log.RegisterFailed.description",
  },
  registerSuccess: {
    name: "Register Success",
    key: "registerSuccess",
    titleKey: "Log.RegisterSuccess.title",
    descriptionKey: "Log.RegisterSuccess.description",
  },
  userEdit: {
    name: "User Edit",
    key: "userEdit",
    titleKey: "Log.UserEdit.title",
    descriptionKey: "Log.UserEdit.description",
  },
  userChangeStatus: {
    name: "User Change Status",
    key: "userChangeStatus",
    titleKey: "Log.UserChangeStatus.title",
    descriptionKey: "Log.UserChangeStatus.description",
  },
  userChangeConfirmation: {
    name: "User Change Confirmation",
    key: "userChangeConfirmation",
    titleKey: "Log.UserChangeConfirmation.title",
    descriptionKey: "Log.UserChangeConfirmation.description",
  },
  userChangePassword: {
    name: "User Change Password",
    key: "userChangePassword",
    titleKey: "Log.UserChangePassword.title",
    descriptionKey: "Log.UserChangePassword.description",
  },
  userLostPassword: {
    name: "User Lost Password",
    key: "userLostPassword",
    titleKey: "Log.UserLostPassword.title",
    descriptionKey: "Log.UserLostPassword.description",
  },
  userResetPassword: {
    name: "User Reset Password",
    key: "userResetPassword",
    titleKey: "Log.UserResetPassword.title",
    descriptionKey: "Log.UserResetPassword.description",
  },
  userCreate: {
    name: "User Create",
    key: "userCreate",
    titleKey: "Log.UserCreate.title",
    descriptionKey: "Log.UserCreate.description",
  },
  databaseError: {
    name: "Database Error",
    key: "databaseError",
    titleKey: "Log.DatabaseError.title",
    descriptionKey: "Log.DatabaseError.description",
  },
  frontSettingsEdit: {
    name: "Front Settings Edit",
    key: "frontSettingsEdit",
    titleKey: "Log.FrontSettingsEdit.title",
    descriptionKey: "Log.FrontSettingsEdit.description",
  },
  emailServiceError: {
    name: "Email Service Error",
    key: "emailServiceError",
    titleKey: "Log.EmailServiceError.title",
    descriptionKey: "Log.EmailServiceError.description",
  },
  accountSecurityLock: {
    name: "Account Security Lock",
    key: "accountSecurityLock",
    titleKey: "Log.AccountSecurityLock.title",
    descriptionKey: "Log.AccountSecurityLock.description",
  },
}

export const logCriticalityKeys = {
  userInfo: {
    name: "User Info",
    key: "userInfo",
    titleKey: "Log.Criticality.UserInfo.title",
    descriptionKey: "Log.Criticality.UserInfo.description",
    color: "",
    icon: <UserRound size={25} />,
  },
  userError: {
    name: "User Error",
    key: "userError",
    titleKey: "Log.Criticality.UserError.title",
    descriptionKey: "Log.Criticality.UserError.description",
    color: "bg-orange-200",
    icon: <UserRoundX size={25} />,
  },
  userSecurity: {
    name: "User Security",
    key: "userSecurity",
    titleKey: "Log.Criticality.UserSecurity.title",
    descriptionKey: "Log.Criticality.UserSecurity.description",
    color: "bg-red-200",
    icon: <ShieldAlert size={25} />,
  },
  systemInfo: {
    name: "System Info",
    key: "systemInfo",
    titleKey: "Log.Criticality.SystemInfo.title",
    descriptionKey: "Log.Criticality.SystemInfo.description",
    color: "",
    icon: <Info size={25} />,
  },
  systemSecurity: {
    name: "System Security",
    key: "systemSecurity",
    titleKey: "Log.Criticality.SystemSecurity.title",
    descriptionKey: "Log.Criticality.SystemSecurity.description",
    color: "bg-red-200",
    icon: <ShieldAlert size={25} />,
  },
  systemError: {
    name: "System Error",
    key: "systemError",
    titleKey: "Log.Criticality.SystemError.title",
    descriptionKey: "Log.Criticality.SystemError.description",
    color: "bg-red-200",
    icon: <Bug size={25} />,
  },
}
