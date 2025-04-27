"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { clientList } from "@/assets/options/config"
import { useInView } from "react-intersection-observer"

export default function HomeClients() {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div ref={ref} className="flex flex-col items-center justify-center w-full">
      <motion.h1
        className="text-3xl font-bold text-center text-white mt-11"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {t("clients")}
      </motion.h1>
      <motion.div
        className="flex overflow-hidden mt-8 w-full"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="flex w-full items-center justify-center"
          initial={{ x: "0%" }}
          animate={inView ? { x: "-100%" } : {}}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            delay: 0.7,
          }}
        >
          {clientList.concat(clientList).map((client, index) => (
            <div key={index} className="flex-shrink-0 md:mx-12 mx-6">
              <Image
                src={client.logo}
                alt={client.name}
                width={130}
                height={130}
                style={{ maxWidth: "130px", maxHeight: "130px" }}
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
