"use client"
import HomeCarousel from "@/features/home/HomeCarousel"
import HomeClients from "@/features/home/homeClients"
import HomeProducts from "@/features/home/homeProducts"
import HomeServices from "@/features/home/homeServices"
import HomeWelcome from "@/features/home/homeWelcome"
import { useState, useEffect } from "react"

export default function Home({ carouselData, isLoggedIn }) {
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      return
    }

    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer)
  }, [isLoggedIn])

  if (showWelcome && !isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-600">
        <HomeWelcome animationReverse={true} />
      </div>
    )
  }

  return (
    <div className="bg-indigo-600">
      <div className="md:flex md:items-center md:justify-center md:w-full md:pt-10 md:pb-10">
        <HomeWelcome isLoggedIn={isLoggedIn} />
        {carouselData && <HomeCarousel initialCarouselData={carouselData} />}
      </div>
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
