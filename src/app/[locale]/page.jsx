import HomeCarousel from "@/features/home/HomeCarousel"
import { getHomeCarouselData } from "@/lib/utils"

export default async function Home() {
  const carouselData = await getHomeCarouselData()

  return (
    <div>
      {carouselData && (
        <HomeCarousel initialCarouselData={JSON.stringify(carouselData)} />
      )}
    </div>
  )
}
