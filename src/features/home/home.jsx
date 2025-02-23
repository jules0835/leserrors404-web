"use client"
import HomeCarousel from "@/features/home/HomeCarousel"
import HomeClients from "@/features/home/homeClients"
import HomeProducts from "@/features/home/homeProducts"
import HomeServices from "@/features/home/homeServices"
import HomeWelcome from "@/features/home/homeWelcome"
import { useState, useEffect } from "react"

export default function Home({ carouselData }) {
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showWelcome) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-600">
        <HomeWelcome animationReverse={true} />
      </div>
    )
  }

  return (
    <div className="bg-indigo-600">
      <div className="md:flex md:items-center md:justify-center md:w-full md:pt-10 md:pb-10">
        <HomeWelcome />
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
