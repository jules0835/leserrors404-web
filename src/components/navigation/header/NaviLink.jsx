"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NaviLinks({ href, name }) {
  const pathname = usePathname()

  return (
    <Link
      className={clsx(" p-2 mx-2 rounded-md transition-all", {
        "font-bold": pathname === href,
      })}
      href={href}
    >
      <p>{name}</p>
    </Link>
  )
}
