import { Link } from "@/i18n/routing"
import { ShoppingCart, AccountCircle, Menu } from "@mui/icons-material"
import LocaleSwitcher from "@/features/navigation/header/LocaleSwitcher"

export default function NavLink() {
  const links = [
    {
      name: "cart",
      href: "/user/order/cart",
      icon: <ShoppingCart className="text-white hover:scale-110" />,
    },
    {
      name: "account",
      href: "/auth/login",
      icon: <AccountCircle className="text-white hover:scale-110" />,
    },
    {
      name: "localeSwitcher",
      icon: <LocaleSwitcher className="text-white " />,
    },
    {
      name: "menu",
      icon: <Menu className="text-white  hover:scale-110" />,
    },
  ]

  return (
    <>
      {links.map((link) => (
        <div key={link.name} className="mx-1">
          {link.href ? (
            <Link href={link.href}>
              <div className="flex hover:cursor-pointer transition-all text-3xl items-center">
                {link.icon}
              </div>
            </Link>
          ) : (
            <div className="flex hover:cursor-pointer transition-all text-3xl items-center">
              {link.icon}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
