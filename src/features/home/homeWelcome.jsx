"use client"
import { company, webAppSettings } from "@/assets/options/config"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export default function HomeWelcome() {
  const t = useTranslations("HomePage")

  return (
    <div className="flex flex-col items-center justify-center md:w-1/2 md:mt-0 pt-8 pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          src={webAppSettings.images.logoNoTextUrl}
          alt="Cyna Logo"
          width={110}
          height={110}
          className="rounded-full bg-white p-4"
        />
      </motion.div>
      <motion.h1
        className="text-4xl font-bold text-center text-white mt-11"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {t("welcome", { company: company.name })}
      </motion.h1>
      <motion.p
        className="mt-4 text-lg text-center text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {t("welcomeMessage")}
      </motion.p>
    </div>
  )
}
