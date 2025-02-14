import { deleteProduct, updateProduct, findProduct } from "@/db/crud/productCrud"
import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"
import { getProductSchema } from "@/features/admin/business/products/utils/product"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"

export async function DELETE(req, { params }) {
    const { Id } = params

    try {
        const res = await deleteProduct(Id)

        if (!res.success) {
            return NextResponse.json({ error: res.message }, { status: 404 })
        }

        return NextResponse.json(res)
    } catch (error) {
        console.error("Failed to delete Product:", error)

        return NextResponse.json({ error: "Failed to delete Product" }, { status: 500 })
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
        const priority = formData.get("priority")
        const isActive = formData.get("isActive")
        const imageFile = formData.get("image")
        const picture = imageFile ? await uploadPublicPicture(imageFile) : null
        const requestBody = { label, description, characteristics, categorie, stock, price, priority, isActive, picture }
        const { searchParams } = new URL(req.url)
        const locale = searchParams.get("locale")
        const t = await getTranslations({ locale, namespace: "Admin.Business.Products.Errors" })
        const productSchema = getProductSchema(t).shape({
            picture: yup.mixed().nullable(),
        })
        await productSchema.validate(requestBody, { abortEarly: false })

        const existingProduct = await findProduct({ label, _id: { $ne: Id } })

        if (existingProduct) {
            return NextResponse.json(
                {
                    error: "ProductAlreadyExists",
                    message: "Product already exists with this label",
                },
                { status: 409 }
            )
        }

        const updatedData = {
            label,
            description,
            characteristics,
            categorie,
            stock,
            price,
            priority,
            isActive,
            ...(picture && { picture }),
        }

        const updatedProduct = await updateProduct(Id, updatedData)

        if (!updatedProduct) {
            return NextResponse.json(
                { error: "ProductNotFound", message: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 })
    } catch (error) {
        console.error("Failed to update Product:", error)

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
