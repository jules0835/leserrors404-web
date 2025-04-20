"use client"
import { motion } from "motion/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"
import { company } from "@/assets/options/config"
import { useTitle } from "@/components/navigation/titleContext"
import DButton from "@/components/ui/DButton"
import { Headset } from "lucide-react"
import { useChat } from "@/features/contact/chatbot/context/chatContext"

export default function CompanyPage() {
  const t = useTranslations("CompanyPage")
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true })
  const { ref: sectionsRef, inView: sectionsInView } = useInView({
    triggerOnce: true,
  })
  const { setTitle } = useTitle()
  const { openChat } = useChat()
  setTitle(t("title"))

  const sections = [
    {
      title: t("history.title"),
      description: t("history.description"),
      image:
        "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1745073703878-BcDcPICKBokLSMX3c12A9ZmLzflk5X",
      imagePosition: "left",
    },
    {
      title: t("mission.title"),
      description: t("mission.description"),
      image:
        "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1745148422086-NKlY0tVdvSXAIfs2DPOVvQyqLic4qm",
      imagePosition: "right",
    },
    {
      title: t("values.title"),
      description: t("values.description"),
      image:
        "https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1745149007088-rmMT0jH9y4AmYGFaKyRODiDya9bdt6",
      imagePosition: "left",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] w-full">
        <Image
          src="https://fimkppvxvt92ijit.public.blob.vercel-storage.com/public/pictures_1745073703878-BcDcPICKBokLSMX3c12A9ZmLzflk5X"
          alt="Company Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          ref={heroRef}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-6">{company.name}</h1>
            <p className="text-xl">{t("heroDescription")}</p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          ref={sectionsRef}
          initial={{ opacity: 0 }}
          animate={sectionsInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                section.imagePosition === "right"
                  ? "md:flex-row-reverse"
                  : "md:flex-row"
              } items-center gap-8 mb-16`}
              initial={{
                opacity: 0,
                x: section.imagePosition === "right" ? 50 : -50,
              }}
              animate={sectionsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="w-full md:w-1/2">
                <div className="relative h-80 w-full">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover rounded-lg shadow-xl"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-600 text-lg">{section.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={sectionsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            {t("farewellTitle")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("farewellMessage")}
          </p>
          <DButton
            styles="mt-8"
            isMain
            onClickBtn={() => {
              openChat()
            }}
          >
            <Headset className="w-4 h-4 mr-2" />
            {t("farewellButton")}
          </DButton>
        </motion.div>
      </div>
    </div>
  )
}
