export const returnError = (t, reason) => {
  switch (reason) {
    case "VOUCHER_NOT_ACTIVE":
      return t("VoucherNotActive")

    case "MIXED_PRODUCT_TYPES":
      return t("MixedProductTypes")

    case "USER_PROFILE_INCOMPLETE":
      return t("userProfileIncomplete")

    default:
      return t("cantCheckout")
  }
}
