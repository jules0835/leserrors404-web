"use client"
import HomeCarousel from "@/features/home/HomeCarousel"
import HomeClients from "@/features/home/homeClients"
import SuggestedProducts from "@/features/suggestions/suggestedProducts"
import HomeServices from "@/features/home/homeServices"
import HomeWelcome from "@/features/home/homeWelcome"
import HomeBanner from "@/features/home/homeBanner"
import { useState, useEffect } from "react"
import ProductCompare from "@/features/suggestions/productCompare"

export default function Home({ carouselData, bannerData, isLoggedIn }) {
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
    <div className="bg-indigo-600 min-h-screen">
      <div className="md:flex md:items-center md:justify-center md:w-full md:pt-10 md:pb-10">
        <HomeWelcome isLoggedIn={isLoggedIn} />
        {carouselData && <HomeCarousel initialCarouselData={carouselData} />}
      </div>
      {bannerData && <HomeBanner initialBannerData={bannerData} />}
      <div className="md:flex md:items-center md:justify-center">
        <HomeClients />
      </div>
      <div className="md:flex md:items-center md:justify-center">
        <ProductCompare />
      </div>
      <div className="px-4 md:px-0">
        <HomeServices />
      </div>
      <div className="px-4 md:px-0">
        <SuggestedProducts />
      </div>
    </div>
  )
}
