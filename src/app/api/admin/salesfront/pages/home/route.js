import {
  findSalesfront,
  createSalesfront,
  updateSalesfront,
} from "@/db/crud/salesfrontCrud"
import { webAppSettings } from "@/assets/options/config"
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

  const updatedSalesfrontSettings = await updateSalesfront(
    // eslint-disable-next-line no-underscore-dangle
    salesfrontSettings._id,
    body
  )

  return Response.json(updatedSalesfrontSettings)
}
