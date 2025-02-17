import { confirmEmailWithToken } from "@/features/auth/utils/accountService"

export default async function Page({ params }) {
  const { token } = await params
  const confirmResult = await confirmEmailWithToken(token)

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-[#2F1F80]">
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          {confirmResult && <div>Email confirmed</div>}
          {!confirmResult && <div>Failed to confirm email</div>}
        </div>
      </div>
    </div>
  )
}
