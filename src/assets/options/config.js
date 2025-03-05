/* eslint-disable max-lines */
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
  Headset,
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
    userProfile: "/user/dashboard/profile",
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
    pictureDefautlUrl:
      "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1740841772986-xr9BpdWDdnkAby45T9GtlLaZcW4PSq",
  },
  shop: {
    products: {
      itemsPerPage: 10,
    },
  },
}

export const tokenExpiration = {
  admin: {
    default: 2 * 60 * 60,
    keepLogin: 24 * 60 * 60,
  },
  user: {
    default: 12 * 60 * 60,
    keepLogin: 48 * 60 * 60,
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
    items: [],
  },
  {
    title: "Buissness",
    translationKey: "business",
    url: "#",
    icon: BriefcaseBusiness,
    isActive: true,
    items: [
      {
        title: "Orders",
        translationKey: "orders",
        url: "/user/dashboard/business/orders",
      },
      {
        title: "Subscriptions",
        translationKey: "subscriptions",
        url: "/user/dashboard/business/subscriptions",
      },
      {
        title: "Payments",
        translationKey: "payments",
        url: "/user/dashboard/business/payments",
      },
    ],
  },
  {
    title: "My Account",
    translationKey: "myAccount",
    icon: UserRound,
    isActive: true,
    items: [
      {
        title: "Profile",
        translationKey: "profile",
        url: "/user/dashboard/profile",
      },
      {
        title: "security",
        translationKey: "security",
        url: "/user/dashboard/profile/security",
      },
      {
        title: "Payment Methods",
        translationKey: "paymentMethods",
        url: "/user/dashboard/profile/payments",
      },
      {
        title: "Settings",
        translationKey: "settings",
        url: "/user/dashboard/profile/settings",
      },
    ],
  },
  {
    title: "Support",
    translationKey: "support",
    icon: Headset,
    isActive: true,
    items: [
      {
        title: "Need Help",
        translationKey: "needHelp",
        url: "/user/dashboard/support",
      },
      {
        title: "Open Ticket",
        translationKey: "openNewTicket",
        url: "/user/dashboard/support/new",
      },
      {
        title: "My Tickets",
        translationKey: "myTickets",
        url: "/user/dashboard/support/tickets",
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
  {
    title: "Your dashboard",
    titleKey: "User.Dashboard.title",
    subTitleKey: "User.Dashboard.subTitle",
    url: "/user/dashboard",
  },
  {
    title: "Security",
    titleKey: "User.Security.title",
    subTitleKey: "User.Security.subTitle",
    url: "/user/dashboard/profile/security",
  },
  {
    title: "Payment Methods",
    titleKey: "User.MyAccount.PaymentMethods.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/profile/payments",
  },
  {
    title: "Settings",
    titleKey: "User.MyAccount.Settings.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/profile/settings",
  },
  {
    title: "Open Ticket",
    titleKey: "User.Support.OpenNewTicket.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/support/new",
  },
  {
    title: "My Tickets",
    titleKey: "User.Support.MyTickets.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/support/tickets",
  },
  {
    title: "Business Orders",
    titleKey: "User.Business.Orders.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/business/orders",
  },
  {
    title: "Business Subscriptions",
    titleKey: "User.Business.Subscriptions.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/business/subscriptions",
  },
  {
    title: "Business Payments",
    titleKey: "User.Business.Payments.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/business/payments",
  },
  {
    title: "Profile",
    titleKey: "User.MyAccount.Profile.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/profile",
  },
  {
    title: "Need Help",
    titleKey: "User.Support.NeedHelp.title",
    subTitleKey: "NoSubTitle",
    url: "/user/dashboard/support",
  },
  {
    title: "Products",
    titleKey: "Admin.Business.Products.title",
    subTitleKey: "Admin.Business.Products.subTitle",
    url: "/admin/business/products",
  },
  {
    title: "Categories",
    titleKey: "Admin.Business.Categories.title",
    subTitleKey: "Admin.Business.Categories.subTitle",
    url: "/admin/business/categories",
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

export const clientList = [
  { name: "Cyna", logo: webAppSettings.images.logoUrl },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "bollore",
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/2/29/Logo_Bollore_2020.svg/2560px-Logo_Bollore_2020.svg.png",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "airbus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Airbus_Logo_2017.svg/2560px-Airbus_Logo_2017.svg.png",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "ubereat",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Uber_Eats_2018_logo.svg/1280px-Uber_Eats_2018_logo.svg.png",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "playstation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/PlayStation_logo_and_wordmark.svg",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "playmobile",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Playmobil_logo.svg/1200px-Playmobil_logo.svg.png",
  },
  { name: "client1", logo: webAppSettings.images.logoUrl },
  {
    name: "netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
  },
]
