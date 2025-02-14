import logoCynaNoText from "@/assets/images/logo_notext.png"
import userDefault from "@/assets/images/user_default.png"
import {
  LayoutDashboard,
  MonitorCog,
  LockKeyhole,
  BriefcaseBusiness,
} from "lucide-react"
export const company = {
  name: "Cyna",
  description: "Web App For Cyna",
  logo: logoCynaNoText,
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
  images: {
    userDefault,
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
    title: "Users Admin",
    titleKey: "Admin.Security.Users.UserDetails.title",
    subTitleKey: "Admin.Security.Users.UserDetails.subTitle",
    url: "/admin/security/users/[Id]",
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
}

export const logCriticalityKeys = {
  userInfo: {
    name: "User Info",
    key: "userInfo",
    titleKey: "Log.Criticality.UserInfo.title",
    descriptionKey: "Log.Criticality.UserInfo.description",
  },
  userError: {
    name: "User Error",
    key: "userError",
    titleKey: "Log.Criticality.UserError.title",
    descriptionKey: "Log.Criticality.UserError.description",
  },
  userSecurity: {
    name: "User Security",
    key: "userSecurity",
    titleKey: "Log.Criticality.UserSecurity.title",
    descriptionKey: "Log.Criticality.UserSecurity.description",
  },
  systemInfo: {
    name: "System Info",
    key: "systemInfo",
    titleKey: "Log.Criticality.SystemInfo.title",
    descriptionKey: "Log.Criticality.SystemInfo.description",
  },
  systemSecurity: {
    name: "System Security",
    key: "systemSecurity",
    titleKey: "Log.Criticality.SystemSecurity.title",
    descriptionKey: "Log.Criticality.SystemSecurity.description",
  },
  systemError: {
    name: "System Error",
    key: "systemError",
    titleKey: "Log.Criticality.SystemError.title",
    descriptionKey: "Log.Criticality.SystemError.description",
  },
}
