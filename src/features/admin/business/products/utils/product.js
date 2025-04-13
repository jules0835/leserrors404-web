/* eslint-disable camelcase */
import * as Yup from "yup"
import stripe from "@/utils/stripe/stripe"

export const getProductSchema = (t) =>
  Yup.object().shape({
    label: Yup.string().required(t("labelRequired")),
    description: Yup.string().required(t("descriptionRequired")),
    picture: Yup.string().required(t("pictureRequired")),
  })

export const createStripeProduct = async ({
  name,
  description,
  price,
  priceMonthly,
  priceAnnual,
  subscription,
  taxe,
}) => {
  const stripeProduct = await stripe.products.create({
    name,
    description,
  })

  let stripePriceIdMonthly = null
  let stripePriceIdAnnual = null
  let stripePriceId = null
  let stripeTaxId = null

  if (subscription) {
    stripePriceIdMonthly = (
      await stripe.prices.create({
        unit_amount: priceMonthly * 100,
        currency: "eur",
        recurring: { interval: "month" },
        product: stripeProduct.id,
      })
    ).id

    stripePriceIdAnnual = (
      await stripe.prices.create({
        unit_amount: priceAnnual * 100,
        currency: "eur",
        recurring: { interval: "year" },
        product: stripeProduct.id,
      })
    ).id
  } else {
    stripePriceId = (
      await stripe.prices.create({
        unit_amount: price * 100,
        currency: "eur",
        product: stripeProduct.id,
      })
    ).id
  }

  if (taxe) {
    const existingTaxRates = await stripe.taxRates.list({
      active: true,
    })
    const existingTaxRate = existingTaxRates.data.find(
      (rate) => rate.percentage === parseFloat(taxe)
    )

    if (existingTaxRate) {
      stripeTaxId = existingTaxRate.id
    } else {
      const newTaxRate = await stripe.taxRates.create({
        display_name: "VAT",
        inclusive: false,
        percentage: parseFloat(taxe),
        country: "FR",
      })
      stripeTaxId = newTaxRate.id
    }
  }

  return {
    stripeProductId: stripeProduct.id,
    stripePriceIdMonthly,
    stripePriceIdAnnual,
    stripePriceId,
    stripeTaxId,
  }
}

export const updateStripeProduct = async ({
  stripeProductId,
  name,
  description,
  price,
  priceMonthly,
  priceAnnual,
  subscription,
  taxe,
}) => {
  const stripeProduct = await stripe.products.update(stripeProductId, {
    name,
    description,
  })

  let stripePriceIdMonthly = null
  let stripePriceIdAnnual = null
  let stripePriceId = null
  let stripeTaxId = null

  const existingPrices = await stripe.prices.list({
    product: stripeProductId,
    active: true,
  })

  await Promise.all(
    existingPrices.data.map((_price) =>
      stripe.prices.update(_price.id, { active: false })
    )
  )

  if (subscription) {
    stripePriceIdMonthly = (
      await stripe.prices.create({
        unit_amount: priceMonthly * 100,
        currency: "eur",
        recurring: { interval: "month" },
        product: stripeProduct.id,
      })
    ).id

    stripePriceIdAnnual = (
      await stripe.prices.create({
        unit_amount: priceAnnual * 100,
        currency: "eur",
        recurring: { interval: "year" },
        product: stripeProduct.id,
      })
    ).id
  } else {
    stripePriceId = (
      await stripe.prices.create({
        unit_amount: price * 100,
        currency: "eur",
        product: stripeProduct.id,
      })
    ).id
  }

  if (taxe) {
    const existingTaxRates = await stripe.taxRates.list({
      active: true,
    })
    const existingTaxRate = existingTaxRates.data.find(
      (rate) => rate.percentage === parseFloat(taxe)
    )

    if (existingTaxRate) {
      stripeTaxId = existingTaxRate.id
    } else {
      const newTaxRate = await stripe.taxRates.create({
        display_name: "VAT",
        inclusive: false,
        percentage: parseFloat(taxe),
        country: "FR",
      })
      stripeTaxId = newTaxRate.id
    }
  }

  return {
    stripeProductId: stripeProduct.id,
    stripePriceIdMonthly,
    stripePriceIdAnnual,
    stripePriceId,
    stripeTaxId,
  }
}
