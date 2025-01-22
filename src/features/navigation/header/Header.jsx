"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import logo from "@/assets/images/logo.webp"
import { Search } from "@mui/icons-material"
import NavLink from "@/features/navigation/header/NavLink"
import { usePathname } from "next/navigation"
import { handleSignOut } from "@/utils/action/handleCredentialSignIn"
import { useSession } from "next-auth/react"

export default function Header() {
  const pathname = usePathname()
  const { status } = useSession()

  if (pathname.includes("/auth/")) {
    return null
  }

  return (
    <header className="bg-[#2F1F80] p-3">
      <div className="flex flex-col md:flex-row justify-between items-center relative">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <Image src={logo} alt="logo" width={130} height={130} />
          </Link>
        </div>

        <div className="w-full md:w-auto md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-4 md:mb-0">
          <div className="bg-white rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all flex md:flex-row md:w-96 ">
            <input
              type="text"
              className="focus:outline-none w-full"
              placeholder="Search"
            />
            <Search className="text-[#2F1F80] hover:scale-125 transition-all hover:cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center space-x-10">
          {status === "authenticated" && (
            <div>
              <button
                onClick={() => handleSignOut()}
                className="text-white bg-[#2F1F80] border border-white px-4 py-2 rounded-full hover:bg-white hover:text-[#2F1F80] transition-all"
              >
                Sign out
              </button>
            </div>
          )}
          <NavLink />
        </div>
      </div>
    </header>
  )
}
