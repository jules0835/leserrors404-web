/* eslint-disable no-underscore-dangle */
import {
  findSalesfront,
  createSalesfront,
  updateSalesfront,
} from "@/db/crud/salesfrontCrud"
import { logKeys, webAppSettings } from "@/assets/options/config"
import { uploadPublicPicture } from "@/utils/database/blobService"
import { Buffer } from "buffer"
import log from "@/lib/log"
import { getReqIsAdmin, getReqUserId } from "@/features/auth/utils/getAuthParam"

export async function GET(req) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get("name")
  let salesfrontSettings = await findSalesfront({ name })

  if (!salesfrontSettings) {
    if (name === webAppSettings.salesfront.homepage.carouselId) {
      log.systemInfo({
        logKey: logKeys.shopSettingsEdit.key,
        message: "Carousel created",
        data: {
          name,
        },
      })
      salesfrontSettings = await createSalesfront({
        name: webAppSettings.salesfront.homepage.carouselId,
        isCarousel: true,
      })
    } else if (name === webAppSettings.salesfront.homepage.alertBannerId) {
      log.systemInfo({
        logKey: logKeys.shopSettingsEdit.key,
        message: "Alert banner created",
        data: {
          name,
        },
      })
      salesfrontSettings = await createSalesfront({
        name: webAppSettings.salesfront.homepage.alertBannerId,
        isBanner: true,
      })
    }
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

  if (body.carouselParts && Array.isArray(body.carouselParts)) {
    await Promise.all(
      body.carouselParts.map(async (part) => {
        if (part.uploadImage) {
          const imageBuffer = Buffer.from(part.uploadImage, "base64")
          part.image = await uploadPublicPicture(imageBuffer)
        }

        if (typeof part.image !== "string") {
          part.image = ""
        }
      })
    )
  }

  const updatedSalesfrontSettings = await updateSalesfront(
    { _id: salesfrontSettings._id },
    body
  )

  if (name === webAppSettings.salesfront.homepage.carouselId) {
    log.systemInfo({
      logKey: logKeys.frontSettingsEdit.key,
      message: "Salesfront home carousel updated",
      newData: { updatedSalesfrontSettings },
      isAdminAction: getReqIsAdmin(req),
      authorId: getReqUserId(req),
    })
  } else if (name === webAppSettings.salesfront.homepage.alertBannerId) {
    log.systemInfo({
      logKey: logKeys.frontSettingsEdit.key,
      message: "Salesfront home alert banner updated",
      newData: { updatedSalesfrontSettings },
      isAdminAction: getReqIsAdmin(req),
      authorId: getReqUserId(req),
    })
  }

  return Response.json(updatedSalesfrontSettings)
}
