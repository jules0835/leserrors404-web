"use client"
import { company, webAppSettings } from "@/assets/options/config"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState, useEffect } from "react"
import animation from "@/assets/images/lockAnnimation.gif"

export default function HomeWelcome({ animationReverse }) {
  const t = useTranslations("HomePage")
  const [reverse, setReverse] = useState(false)

  useEffect(() => {
    if (!animationReverse) {
      return undefined
    }

    const timer = setTimeout(() => {
      setReverse(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [animationReverse])

  return (
    <div className="flex flex-col items-center justify-center md:w-1/2 md:pt-0 pb-10 pt-10">
      {animationReverse && (
        <Image
          src={animation}
          alt="Cyna Animation"
          width={430}
          height={40}
          className="rounded-full -mt-80"
        />
      )}
      {!animationReverse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            reverse ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src={webAppSettings.images.logoNoTextUrl}
            alt="Cyna Logo"
            width={110}
            height={110}
            className="rounded-full bg-white p-4 mb-8"
          />
        </motion.div>
      )}
      <motion.h1
        className="text-4xl font-bold text-center text-white "
        initial={{ opacity: 0, y: -50 }}
        animate={reverse ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {animationReverse
          ? t("welcome", { company: company.name })
          : `${company.name}`}
      </motion.h1>
      {animationReverse && (
        <motion.p
          className="mt-4 text-lg text-center text-white font-semibold"
          initial={{ opacity: 0, y: 50 }}
          animate={reverse ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t("welcomeMessageAnimation")}
        </motion.p>
      )}
      {!animationReverse && (
        <div>
          <motion.p
            className="mt-4 text-lg text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={reverse ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t("welcomeMessage")}
          </motion.p>
          <motion.p
            className="mt-4 text-lg text-center text-white md:mx-32 mx-5"
            initial={{ opacity: 0, y: 50 }}
            animate={reverse ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t("welcomeMessageDescription")}
          </motion.p>
        </div>
      )}
    </div>
  )
}
