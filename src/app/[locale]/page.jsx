import Home from "@/features/home/home"
import { getHomeCarouselData } from "@/lib/utils"
import { auth } from "@/auth"

export default async function HomePage() {
  const carouselData = await getHomeCarouselData()
  const session = await auth()

  return (
    <div>
      <Home
        carouselData={JSON.stringify(carouselData)}
        isLoggedIn={Boolean(session)}
      />
    </div>
  )
}
