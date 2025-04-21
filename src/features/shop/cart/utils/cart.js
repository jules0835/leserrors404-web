/* eslint-disable max-params */
import { Skeleton } from "@/components/ui/skeleton"

export const returnError = (t, reason) => {
  switch (reason) {
    case "VOUCHER_NOT_ACTIVE":
      return t("VoucherNotActive")

    case "MIXED_PRODUCT_TYPES":
      return t("MixedProductTypes")

    case "USER_PROFILE_INCOMPLETE":
      return t("userProfileIncomplete")

    case "PRODUCT_NOT_ACTIVE":
      return t("ProductNotActive")

    case "PRODUCT_OUT_OF_STOCK":
      return t("ProductOutOfStock")

    case "PRODUCT_OUT_OF_STOCK_USER_QUANTITY":
      return t("ProductOutOfStockUserQuantity")

    case "BILLING_ADDRESS_INCOMPLETE":
      return t("BillingAddressIncomplete")

    default:
      return t("cantCheckout")
  }
}

export const displayLoadingCalcul = (value, size, isUpdating, isLoading) =>
  isUpdating || isLoading ? (
    <Skeleton className={`w-${size} h-6`} />
  ) : (
    `${value || 0} €`
  )
