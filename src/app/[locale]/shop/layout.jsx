"use client"

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen mx-7 md:mt-14 pb-10 mt-40">
      <div className="pt-4">{children}</div>
    </div>
  )
}
