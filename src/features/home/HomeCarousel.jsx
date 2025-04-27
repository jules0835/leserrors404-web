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
import { motion } from "motion/react"
import { useInView } from "react-intersection-observer"
import { trimString } from "@/lib/utils"

export default function HomeCarousel({ initialCarouselData }) {
  const [carouselData] = useState(JSON.parse(initialCarouselData))
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const t = useTranslations("HomePage")
  const locale = useLocale()
  const { ref, inView } = useInView({ triggerOnce: true })

  if (
    !carouselData ||
    !carouselData.carouselParts ||
    carouselData.carouselParts.length === 0
  ) {
    return null
  }

  const hasMultipleImages = carouselData.carouselParts.length > 1

  return (
    <motion.div
      ref={ref}
      className="md:w-1/2 flex justify-center m-4 rounded-lg shadow-lg bg-white overflow-hidden relative z-20"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.7 }}
    >
      <div className="w-full">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-96">
            {carouselData &&
              carouselData.carouselParts?.length > 0 &&
              carouselData.carouselParts.map((part) => (
                <CarouselItem
                  key={part._id}
                  className="relative h-96 overflow-hidden rounded-lg"
                >
                  <div className="w-full h-full relative">
                    <Image
                      src={part.image || "/default_large.png"}
                      className="object-cover rounded-lg"
                      alt={part.titleTrans[locale]}
                      width={1920}
                      height={1080}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  {part.titleTrans[locale] && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 m-4 p-6 bg-white rounded-sm shadow-lg md:w-4/12 w-1/2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {part.titleTrans[locale]}
                        </h3>
                        <p className="mt-2 text-sm md:block hidden">
                          {part.descriptionTrans[locale]}
                        </p>
                        <p className="mt-2 text-sm md:hidden">
                          {trimString(part.descriptionTrans[locale], 50)}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {part.link && (
                          <Link
                            href={part.link}
                            className="bg-indigo-500 rounded-sm p-2 text-white hover:bg-indigo-700 w-full text-center"
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
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 mb-4 flex space-x-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          )}
        </Carousel>
      </div>
    </motion.div>
  )
}
