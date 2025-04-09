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

export default function TopCartMessages({ cart, isLoading, session }) {
  const t = useTranslations("Shop.Cart")

  return (
    <div>
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "MIXED_PRODUCT_TYPES" && (
          <div className="bg-orange-200 p-4 rounded-md border border-orange-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <Info size={40} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-center">
                  {t("mixedProductTypes")}
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 text-center">
              {t("mixedProductTypesSubtitle")}
            </p>
          </div>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "USER_PROFILE_INCOMPLETE" && (
          <div className="bg-orange-200 p-4 rounded-md border border-orange-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <UserRoundX size={48} />
              </div>
              <div>
                <h2 className="text-xl text-center font-bold">
                  {t("userProfileIncomplete")}
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 text-center">
              {t("userProfileIncompleteSubtitle")}
            </p>
            <DButton isMain withLink="/user/dashboard/profile">
              {t("completeProfile")}
            </DButton>
          </div>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "VOUCHER_NOT_ACTIVE" && (
          <div className="bg-orange-200 p-4 rounded-md border border-orange-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <TicketPercent size={48} />
              </div>
              <div>
                <h2 className="text-xl text-center font-bold">
                  {t("voucherNotActive")}
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 text-center">
              {t("voucherNotActiveSubtitle")}
            </p>
          </div>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_NOT_ACTIVE" && (
          <div className="bg-orange-200 p-4 rounded-md border border-orange-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <FileX2 size={48} />
              </div>
              <div>
                <h2 className="text-xl text-center font-bold">
                  {t("productNotActive")}
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 text-center">
              {t("productNotActiveSubtitle")}
            </p>
          </div>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK" && (
          <div className="bg-red-200 p-4 rounded-md border border-red-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl text-center font-bold text-red-800">
                  {t("productOutOfStock")}
                </h2>
              </div>
            </div>

            <p className="text-red-700 mt-2 text-center">
              {t("productOutOfStockSubtitle")}
            </p>
          </div>
        )}
      {cart?.checkout?.reason &&
        cart?.checkout?.reason === "PRODUCT_OUT_OF_STOCK_USER_QUANTITY" && (
          <div className="bg-red-200 p-4 rounded-md border border-red-600">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl text-center font-bold text-red-800">
                  {t("productOutOfStockUserQuantity")}
                </h2>
              </div>
            </div>

            <p className="text-red-700 mt-2 text-center">
              {t("productOutOfStockUserQuantitySubtitle")}
            </p>
          </div>
        )}
      {!isLoading && !session && (
        <div className="space-y-4">
          <div className="flex justify-center flex-col items-center space-y-4">
            <UserPlus size={48} />
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
