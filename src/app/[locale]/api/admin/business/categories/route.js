import {
  findCategorie,
  getCategories,
  createCategorie,
} from "@/db/crud/categorieCrud"
import { getTranslations } from "next-intl/server"
import { getCategorieSchema } from "@/features/admin/business/categories/utils/categorie"
import { NextResponse } from "next/server"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function getCategoriesList(size = 10, page = 1, query = "") {
  try {
    const res = await getCategories(size, page, query)

    return res
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch Categories",
      error,
      data: {
        size,
        page,
        query,
      },
    })

    return { Categories: [], total: 0 }
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const limit = parseInt(searchParams.get("limit"), 10) || 10
  const page = parseInt(searchParams.get("page"), 10) || 1
  const query = searchParams.get("query") || ""

  try {
    const res = await getCategoriesList(limit, page, query)

    return Response.json(res)
  } catch (error) {
    log.systemError({
      logKey: logKeys.internalError.key,
      message: "Failed to fetch Categories",
      error,
      data: {
        limit,
        page,
        query,
      },
    })

    return Response.json(
      { error: "Failed to fetch Categories" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const label = formData.get("label")
    const description = formData.get("description")
    const picture = await uploadPublicPicture(formData.get("image"))
    const requestBody = { label, description, picture }
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({
      locale,
      namespace: "Admin.Business.Categories.Errors",
    })
    const categorieSchema = getCategorieSchema(t)
    await categorieSchema.validate(requestBody, { abortEarly: false })

    if (await findCategorie(requestBody)) {
      return NextResponse.json(
        {
          error: "CategorieAlreadyExists",
          message: "Categorie already exists with this label",
        },
        { status: 409 }
      )
    }

    let categorie = {
      label: JSON.parse(label),
      description: JSON.parse(description),
      picture,
    }
    categorie = await createCategorie(categorie)

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Categorie created",
      data: {
        categorie,
      },
    })

    return NextResponse.json({ success: true, categorie }, { status: 201 })
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
      message: "Failed to create Categorie",
      technicalMessage: error.message,
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
