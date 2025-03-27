import { Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { AnimatedReload } from "@/components/actions/AnimatedReload"

export default function DButton({
  children,
  onClickBtn,
  isMain,
  styles,
  isDisabled,
  isLoading,
  withLink,
  isSubmit,
  padding,
}) {
  const mainStyles = `w-full mt-5 text-white bg-[#2F1F80] focus:ring-0 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-center items-center ${
    isDisabled
      ? ""
      : "hover:bg-[#2F1F89] active:bg-[#401bc1] hover:opacity-90 hover:cursor-pointer"
  }`
  const secondaryStyles = `w-full mt-5 text-primary-600 bg-white focus:ring-0 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-primary-600 flex justify-center items-center ${
    isDisabled
      ? ""
      : "hover:bg-gray-100 active:bg-gray-300 hover:cursor-pointer"
  }`

  return (
    <div>
      {withLink ? (
        <Link href={withLink}>
          <button
            type={isSubmit ? "submit" : "button"}
            onClick={onClickBtn}
            className={`${isMain ? mainStyles : secondaryStyles} ${
              isDisabled || isLoading ? "opacity-60 cursor-not-allowed" : ""
            } ${styles} ${padding || "py-2 px-4"}`}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={25} />
            ) : (
              children
            )}
          </button>
        </Link>
      ) : (
        <button
          type={isSubmit ? "submit" : "button"}
          onClick={onClickBtn}
          className={`${isMain ? mainStyles : secondaryStyles} ${
            isDisabled || isLoading ? "opacity-60 cursor-not-allowed" : ""
          }${styles} ${padding || "py-2 px-4"}`}
          disabled={isDisabled || isLoading}
        >
          {isLoading ? <AnimatedReload /> : children}
        </button>
      )}
    </div>
  )
}
