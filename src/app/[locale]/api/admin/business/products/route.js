import { findProduct, getProducts, createProduct } from "@/db/crud/productCrud"
import { getTranslations } from "next-intl/server"
import { getProductSchema } from "@/features/admin/business/products/utils/product"
import { NextResponse } from "next/server"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function getProductsList(size = 10, page = 1, query = "") {
  try {
    const res = await getProducts(size, page, query)

    return res
  } catch (error) {
    return { Products: [], total: 0 }
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit"), 10) || 10
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("query") || ""

  try {
    const res = await getProductsList(limit, page, query)

    return Response.json(res)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch Products",
      isError: true,
      technicalMessage: error.message,
    })

    return Response.json({ error: "Failed to fetch Products" }, { status: 500 })
  }
}

export async function POST(req) {
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
    const picture = await uploadPublicPicture(formData.get("image"))
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
    }
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({
      locale,
      namespace: "Admin.Business.Products.Errors",
    })
    const productSchema = getProductSchema(t)
    await productSchema.validate(requestBody, { abortEarly: false })

    if (await findProduct({ label: JSON.parse(label) })) {
      return NextResponse.json(
        {
          error: "ProductAlreadyExists",
          message: "Product already exists with this label",
        },
        { status: 409 }
      )
    }

    let product = {
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
      subscription: JSON.parse(subscription),
      picture,
    }
    product = await createProduct(product)

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Product created",
      data: product,
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
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
      message: "Failed to create product",
      isError: true,
      technicalMessage: error.message,
    })

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
