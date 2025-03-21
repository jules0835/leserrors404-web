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
