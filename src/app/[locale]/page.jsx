import { Separator } from "@/components/ui/separator"
import HomeCarousel from "@/features/home/HomeCarousel"
import HomeClients from "@/features/home/homeClients"
import HomeProducts from "@/features/home/homeProducts"
import HomeServices from "@/features/home/homeServices"
import HomeWelcome from "@/features/home/homeWelcome"
import { getHomeCarouselData } from "@/lib/utils"

export default async function Home() {
  const carouselData = await getHomeCarouselData()

  return (
    <div className="bg-indigo-600">
      <div className="md:flex md:items-center md:justify-center md:w-full md:pt-10 md:pb-10">
        <HomeWelcome />
        {carouselData && (
          <HomeCarousel initialCarouselData={JSON.stringify(carouselData)} />
        )}
      </div>
      <Separator className="mt-4 h-1 bg-indigo-800" />
      <div className="md:flex md:items-center md:justify-center">
        <HomeClients />
      </div>
      <div>
        <HomeServices />
      </div>
      <div>
        <HomeProducts />
      </div>
    </div>
  )
}
