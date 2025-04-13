import {
  Info,
  TicketPercent,
  UserRoundX,
  FileX2,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import DButton from "@/components/ui/DButton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TopCartMessages({ cart, isLoading, session }) {
  const t = useTranslations("Shop.Cart")

  return (
    <div className="space-y-4">
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "MIXED_PRODUCT_TYPES" && (
          <Alert variant="destructive" className="border-2">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("mixedProductTypes")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("mixedProductTypesSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "USER_PROFILE_INCOMPLETE" && (
          <Alert variant="destructive" className="border-2">
            <UserRoundX className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("userProfileIncomplete")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("userProfileIncompleteSubtitle")}
            </AlertDescription>
            <div className="mt-4">
              <DButton isMain withLink="/user/dashboard/profile">
                {t("completeProfile")}
              </DButton>
            </div>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "VOUCHER_NOT_ACTIVE" && (
          <Alert variant="destructive" className="border-2">
            <TicketPercent className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("voucherNotActive")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("voucherNotActiveSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_NOT_ACTIVE" && (
          <Alert variant="destructive" className="border-2">
            <FileX2 className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("productNotActive")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("productNotActiveSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK" && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("productOutOfStock")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("productOutOfStockSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK_USER_QUANTITY" && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              {t("productOutOfStockUserQuantity")}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {t("productOutOfStockUserQuantitySubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {!isLoading && !session && (
        <div className="space-y-4">
          <div className="flex justify-center flex-col items-center space-y-4">
            <UserPlus size={48} className="text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-center mb-2">
            {t("loginToProceed")}
          </h1>
          <div className="flex space-x-2">
            <div className="w-full">
              <DButton
                isMain
                withLink="/auth/login"
                styles={"flex-grow  w-full"}
              >
                {t("login")}
              </DButton>
            </div>
            <div className="w-full">
              <DButton withLink="/auth/register" styles={"flex-grow  w-full"}>
                {t("register")}
              </DButton>
            </div>
          </div>
          <Separator />
        </div>
      )}
    </div>
  )
}
