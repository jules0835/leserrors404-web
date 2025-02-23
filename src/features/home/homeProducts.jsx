"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@/i18n/routing"

const homeCyberProducts = [
  {
    title: "1Cyber Security",
    description: "We provide the best cyber security services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "2Web Development",
    description: "We provide the best web development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "3Mobile Development",
    description: "We provide the best mobile development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "4Cyber Security",
    description: "We provide the best cyber security services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "5Web Development",
    description: "We provide the best web development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "6Mobile Development",
    description: "We provide the best mobile development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "7Web Development",
    description: "We provide the best web development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "8Mobile Development",
    description: "We provide the best mobile development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "çWeb Development",
    description: "We provide the best web development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
]

export default function HomeProducts() {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <div ref={ref} className="w-full pb-10 px-10">
      <motion.h1
        className="text-3xl font-bold text-center text-white mt-11"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {t("ourProducts")}
      </motion.h1>
      <motion.div
        className="w-full mx-auto px-8 mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {homeCyberProducts.map((product, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full md:basis-1/4"
              >
                <Card className="border-none shadow-lg rounded-2xl">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <h2 className="text-xl font-bold mt-4">{product.title}</h2>
                    <p className="mt-2">{product.description}</p>
                    <Link
                      href={product.link}
                      className="mt-4 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700"
                    >
                      {t("learnMore")}
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between mt-4">
            <CarouselPrevious className="w-10 h-10 border-none shadow-md" />
            <CarouselNext className="w-10 h-10 border-none shadow-md" />
          </div>
        </Carousel>
      </motion.div>
    </div>
  )
}
