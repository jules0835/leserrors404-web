/* eslint-disable no-underscore-dangle */
import {
  findSalesfront,
  createSalesfront,
  updateSalesfront,
} from "@/db/crud/salesfrontCrud"
import { webAppSettings } from "@/assets/options/config"
import { uploadPublicPicture } from "@/utils/database/blobService"
import { Buffer } from "buffer"

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get("name")
  let salesfrontSettings = await findSalesfront({ name })

  if (
    !salesfrontSettings ||
    salesfrontSettings.key === webAppSettings.salesfront.homepage.carouselId
  ) {
    salesfrontSettings = await createSalesfront({
      name: webAppSettings.salesfront.homepage.carouselId,
      isCarousel: true,
    })
  }

  if (
    !salesfrontSettings ||
    salesfrontSettings.key === webAppSettings.salesfront.homepage.alertBannerId
  ) {
    salesfrontSettings = await createSalesfront({
      name: webAppSettings.salesfront.homepage.alertBannerId,
      isBanner: true,
    })
  }

  return Response.json(salesfrontSettings)
}

export async function PUT(req) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get("name")
  const body = await req.json()
  const salesfrontSettings = await findSalesfront({ name })

  if (!salesfrontSettings) {
    return Response.error("Salesfront settings not found")
  }

  await Promise.all(
    body.carouselParts.map(async (part) => {
      if (part.uploadImage) {
        const imageBuffer = Buffer.from(part.uploadImage, "base64")
        part.image = await uploadPublicPicture(imageBuffer)
      }
    })
  )

  const updatedSalesfrontSettings = await updateSalesfront(
    salesfrontSettings._id,
    body
  )

  return Response.json(updatedSalesfrontSettings)
}
