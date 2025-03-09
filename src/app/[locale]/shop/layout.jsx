"use client"

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen mx-7 my-2 md:mt-16 mt-40">
      <div className="pt-4">{children}</div>
    </div>
  )
}
