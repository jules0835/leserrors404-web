import { Link } from "@/i18n/routing"
import LocaleSwitcher from "@/features/navigation/header/LocaleSwitcher"
import { UserNav } from "@/features/navigation/header/UserNav"
import ShoppingCart from "@/features/navigation/header/ShoppingCart"
import MobileMenu from "@/features/navigation/header/MobileMenu"

export default function NavLink() {
  const links = [
    {
      name: "mobileMenu",
      icon: <MobileMenu />,
    },
    {
      name: "cart",
      icon: <ShoppingCart />,
    },
    {
      name: "localeSwitcher",
      icon: <LocaleSwitcher white={true} />,
    },
    {
      name: "account",
      icon: <UserNav className="text-white hover:scale-110" />,
    },
  ]

  return (
    <>
      {links.map((link) => (
        <div key={link.name} className="mx-4">
          {link.href ? (
            <Link href={link.href}>
              <div className="flex hover:cursor-pointer transition-all text-3xl items-center">
                {link.icon}
              </div>
            </Link>
          ) : (
            <div className="flex hover:cursor-pointer transition-all ">
              {link.icon}
            </div>
          )}
        </div>
      ))}
    </>
  )
}
