import Home from "@/features/home/home"
import { getHomeCarouselData } from "@/lib/utils"

export default async function HomePage() {
  const carouselData = await getHomeCarouselData()

  return (
    <div>
      <Home carouselData={JSON.stringify(carouselData)} />
    </div>
  )
}
