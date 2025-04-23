import Home from "@/features/home/home"
import { getHomeCarouselData, getHomeBannerData } from "@/lib/utils"
import { auth } from "@/auth"

export default async function HomePage() {
  const carouselData = await getHomeCarouselData()
  const bannerData = await getHomeBannerData()
  const session = await auth()

  return (
    <div className="md:pt-10">
      <Home
        carouselData={JSON.stringify(carouselData)}
        bannerData={JSON.stringify(bannerData)}
        isLoggedIn={Boolean(session)}
      />
    </div>
  )
}
