import {
  deleteCategorie,
  updateCategorie,
  findCategorie,
} from "@/db/crud/categorieCrud"
import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"
import { getCategorieSchema } from "@/features/admin/business/categories/utils/categorie"
import * as yup from "yup"
import { uploadPublicPicture } from "@/utils/database/blobService"
import log from "@/lib/log"
import { logKeys } from "@/assets/options/config"

export async function DELETE(req, { params }) {
  const { Id } = params

  try {
    const res = await deleteCategorie(Id)

    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 404 })
    }

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Categorie deleted",
      data: {
        categorieId: Id,
      },
    })

    return NextResponse.json(res)
  } catch (error) {
    log.systemError({
      logKey: logKeys.shopSettingsError.key,
      message: "Failed to delete Categorie",
      error,
    })

    return NextResponse.json(
      { error: "Failed to delete Categorie" },
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
    const isActive = formData.get("isActive")
    const imageFile = formData.get("image")
    const picture = imageFile ? await uploadPublicPicture(imageFile) : null
    const requestBody = { label, description, isActive, picture }
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get("locale")
    const t = await getTranslations({
      locale,
      namespace: "Admin.Business.Categories.Errors",
    })
    const categorieSchema = getCategorieSchema(t).shape({
      picture: yup.mixed().nullable(),
    })
    await categorieSchema.validate(requestBody, { abortEarly: false })

    const existingCategorie = await findCategorie({
      label: JSON.parse(label),
      _id: { $ne: Id },
    })

    if (existingCategorie) {
      return NextResponse.json(
        {
          error: "CategorieAlreadyExists",
          message: "Categorie already exists with this label",
        },
        { status: 409 }
      )
    }

    const updatedData = {
      label: JSON.parse(label),
      description: JSON.parse(description),
      isActive,
      ...(picture && { picture }),
    }
    const updatedCategorie = await updateCategorie(Id, updatedData)

    if (!updatedCategorie) {
      return NextResponse.json(
        { error: "CategorieNotFound", message: "Categorie not found" },
        { status: 404 }
      )
    }

    log.systemInfo({
      logKey: logKeys.shopSettingsEdit.key,
      message: "Categorie updated",
      oldData: existingCategorie,
      newData: updatedCategorie,
      data: {
        categorieId: Id,
      },
    })

    return NextResponse.json(
      { success: true, categorie: updatedCategorie },
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
      message: "Failed to update Categorie",
      error,
    })

    return NextResponse.json(
      { error: "InternalServerError", message: "Something went wrong" },
      { status: 500 }
    )
  }
}
