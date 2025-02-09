/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
/* eslint-disable max-lines-per-function */
"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import Autoplay from "embla-carousel-autoplay"
import { useState, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"

export default function HomeCarousel({ initialCarouselData }) {
  const [carouselData] = useState(JSON.parse(initialCarouselData))
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const t = useTranslations("HomePage")
  const locale = useLocale()

  if (!carouselData.carouselParts || carouselData.carouselParts.length === 0) {
    return null
  }

  const hasMultipleImages = carouselData.carouselParts.length > 1

  return (
    <div className="w-full bg-indigo-600 flex justify-center">
      <div className="max-w-screen-lg w-full">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-96">
            {carouselData &&
              carouselData.carouselParts?.length > 0 &&
              carouselData.carouselParts.map((part) => (
                <CarouselItem key={part._id} className="relative">
                  <Image
                    src={part.image || "/default_large.png"}
                    alt={part.titleTrans[locale]}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                  {part.titleTrans[locale] && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 m-4 p-6 bg-white rounded-lg shadow-lg">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {part.titleTrans[locale]}
                        </h3>
                        {
                          <p className="mt-2 text-sm">
                            {part.descriptionTrans[locale]}
                          </p>
                        }
                      </div>
                      <div className="mt-4">
                        {part.link && (
                          <Link
                            href={part.link}
                            className="bg-indigo-500 rounded-lg p-2 text-white hover:bg-indigo-700"
                          >
                            {t("HomePage.carouselButtonMoreInfos")}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </CarouselItem>
              ))}
          </CarouselContent>
          {hasMultipleImages && <CarouselPrevious />}
          {hasMultipleImages && <CarouselNext />}
        </Carousel>
      </div>
    </div>
  )
}
