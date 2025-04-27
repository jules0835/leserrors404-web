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
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("mixedProductTypes")}
            </AlertTitle>
            <AlertDescription>
              {t("mixedProductTypesSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "USER_PROFILE_INCOMPLETE" && (
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <UserRoundX className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("userProfileIncomplete")}
            </AlertTitle>
            <AlertDescription>
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
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <TicketPercent className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("voucherNotActive")}
            </AlertTitle>
            <AlertDescription>{t("voucherNotActiveSubtitle")}</AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_NOT_ACTIVE" && (
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <FileX2 className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("productNotActive")}
            </AlertTitle>
            <AlertDescription>{t("productNotActiveSubtitle")}</AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK" && (
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("productOutOfStock")}
            </AlertTitle>
            <AlertDescription>
              {t("productOutOfStockSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK_USER_QUANTITY" && (
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("productOutOfStockUserQuantity")}
            </AlertTitle>
            <AlertDescription>
              {t("productOutOfStockUserQuantitySubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "BILLING_ADDRESS_INCOMPLETE" && (
          <Alert variant="destructive" className="border-2 bg-destructive/5">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              {t("billingAddressIncomplete")}
            </AlertTitle>
            <AlertDescription>
              {t("billingAddressIncompleteSubtitle")}
            </AlertDescription>
          </Alert>
        )}
      {!isLoading && !session && (
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4 p-6 bg-primary/5 rounded-lg border-2 border-primary/10">
            <UserPlus className="h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold text-center">
              {t("loginToProceed")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
              <DButton isMain withLink="/auth/login" className="flex-1">
                {t("login")}
              </DButton>
              <DButton withLink="/auth/register" className="flex-1">
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
