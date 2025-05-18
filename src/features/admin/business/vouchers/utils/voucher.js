import * as Yup from "yup"

export const getVoucherSchema = (t) =>
  Yup.object().shape({
    code: Yup.string(),
    type: Yup.string()
      .oneOf(["percentage", "fixed"])
      .required(t("requiredType")),
    amount: Yup.number().min(1, t("amountMin")).required(t("requiredAmount")),
    minPurchaseAmount: Yup.number().min(0, t("minPurchaseAmountMin")),
    description: Yup.string(),
  })
