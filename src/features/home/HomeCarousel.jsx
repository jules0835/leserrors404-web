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
      className="md:w-1/2 flex justify-center m-4 rounded-lg shadow-lg bg-white"
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
                <CarouselItem key={part._id} className="relative h-96">
                  <Image
                    src={part.image || "/default_large.png"}
                    className="object-cover w-full h-full"
                    alt={part.titleTrans[locale]}
                    width={1920}
                    height={1080}
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
