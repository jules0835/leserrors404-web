import { findProduct, getProducts, createProduct } from "@/db/crud/productCrud"
import { getTranslations } from "next-intl/server"
import { getProductSchema } from "@/features/admin/business/products/utils/product"
import { NextResponse } from "next/server"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"

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
        const priority = formData.get("priority")
        const picture = await uploadPublicPicture(formData.get("image"))
        const requestBody = { label, description, characteristics, categorie, stock, price, priority, picture }
        const { searchParams } = new URL(req.url)
        const locale = searchParams.get("locale")
        const t = await getTranslations({ locale, namespace: "Admin.Business.Products.Errors" })
        const productSchema = getProductSchema(t)
        await productSchema.validate(requestBody, { abortEarly: false })

        if (await findProduct(requestBody)) {
            return NextResponse.json(
                {
                    error: "ProductAlreadyExists",
                    message: "Product already exists with this label",
                },
                { status: 409 }
            )
        }

        let product = {
            label,
            description,
            characteristics,
            categorie,
            stock,
            price,
            priority,
            picture,
        }
        product = await createProduct(product)

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

        return NextResponse.json(
            { error: "InternalServerError", message: "Something went wrong" },
            { status: 500 }
        )
    }
}