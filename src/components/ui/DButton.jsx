import { Loader2 } from "lucide-react"
import Link from "next/link"

const mainStyles =
  "w-full mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#2F1F80] hover:opacity-90 flex justify-center items-center"
const secondaryStyles =
  "w-full mt-5 text-primary-600 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-primary-600 flex justify-center items-center"
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
          {isLoading ? (
            <Loader2 className="animate-spin" size={25} />
          ) : (
            children
          )}
        </button>
      )}
    </div>
  )
}
