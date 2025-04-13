import {
  deleteProduct,
  updateProduct,
  findProduct,
} from "@/db/crud/productCrud"
import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"
import {
  getProductSchema,
  updateStripeProduct,
} from "@/features/admin/business/products/utils/product"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function DELETE(req, { params }) {
  const { Id } = params

  try {
    const res = await deleteProduct(Id)

    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 404 })
    }

    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Product" },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  const { Id } = params

  try {
    const formData = await req.formData()
    const label = formData.get("label")
    const description = formData.get("description")
    const characteristics = formData.get("characteristics")
    const categorie = formData.get("categorie")
    const stock = formData.get("stock")
    const price = formData.get("price")
    const priceMonthly = formData.get("priceMonthly")
    const priceAnnual = formData.get("priceAnnual")
    const priority = formData.get("priority")
    const taxe = formData.get("taxe")
    const subscription = formData.get("subscription")
    const imageFile = formData.get("image")
    const isActive = formData.get("isActive")
    const picture = imageFile ? await uploadPublicPicture(imageFile) : null
    const requestBody = {
      label,
      description,
      characteristics,
      categorie,
      stock,
      price,
      priceMonthly,
      priceAnnual,
      priority,
      taxe,
      subscription,
      picture,
      isActive,
    }
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({
      locale,
      namespace: "Admin.Business.Products.Errors",
    })
    const productSchema = getProductSchema(t).shape({
      picture: yup.mixed().nullable(),
    })
    await productSchema.validate(requestBody, { abortEarly: false })

    const existingProduct = await findProduct({
      label: JSON.parse(label),
      _id: { $ne: Id },
    })

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "ProductAlreadyExists",
          message: "Product already exists with this label",
        },
        { status: 409 }
      )
    }

    const labelObj = JSON.parse(label)
    const descriptionObj = JSON.parse(description)
    const name = labelObj.en || Object.values(labelObj)[0]
    const desc = descriptionObj.en || Object.values(descriptionObj)[0]
    const currentProduct = await findProduct({ _id: Id })

    if (!currentProduct) {
      return NextResponse.json(
        { error: "ProductNotFound", message: "Product not found" },
        { status: 404 }
      )
    }

    const stripeData = await updateStripeProduct({
      stripeProductId: currentProduct.stripeProductId,
      name,
      description: desc,
      price: JSON.parse(price),
      priceMonthly: JSON.parse(priceMonthly),
      priceAnnual: JSON.parse(priceAnnual),
      subscription: JSON.parse(subscription),
      taxe: JSON.parse(taxe),
    })
    const updatedData = {
      label: JSON.parse(label),
      description: JSON.parse(description),
      characteristics: JSON.parse(characteristics),
      categorie: JSON.parse(categorie),
      stock: JSON.parse(stock),
      price: JSON.parse(price),
      priceMonthly: JSON.parse(priceMonthly),
      priceAnnual: JSON.parse(priceAnnual),
      priority: JSON.parse(priority),
      taxe: JSON.parse(taxe),
      isActive,
      subscription: JSON.parse(subscription),
      ...(picture && { picture }),
      stripeProductId: stripeData.stripeProductId,
      stripePriceIdMonthly: stripeData.stripePriceIdMonthly,
      stripePriceIdAnnual: stripeData.stripePriceIdAnnual,
      stripePriceId: stripeData.stripePriceId,
      stripeTaxId: stripeData.stripeTaxId,
    }
    const updatedProduct = await updateProduct(Id, updatedData)

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "ProductNotFound", message: "Product not found" },
        { status: 404 }
      )
    }

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Product updated",
      data: updatedProduct,
    })

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.inner.map((err) => err.message).join(", ")

      return NextResponse.json(
        {
          error: "ValidationError",
          message: validationErrors,
        },
        { status: 400 }
      )
    }

    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to update product",
      technicalMessage: error.message,
      isError: true,
      data: {
        error,
      },
    })

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
