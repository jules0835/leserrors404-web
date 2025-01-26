import logoCynaNoText from "@/assets/images/logo_notext.png"
import userDefault from "@/assets/images/user_default.png"
import { LayoutDashboard, MonitorCog } from "lucide-react"
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
]

export const pagesNames = [
  {
    title: "Home Page",
    titleKey: "Admin.SalesFront.HomePage.title",
    subTitleKey: "Admin.SalesFront.HomePage.subTitle",
    url: "/admin/salesfront/pages/home",
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
