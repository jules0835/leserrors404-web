"use client"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

const homeCyberCategories = [
  {
    title: "Cyber Security",
    description: "We provide the best cyber security services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "Web Development",
    description: "We provide the best web development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
  {
    title: "Mobile Development",
    description: "We provide the best mobile development services",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png",
    link: "/cyber-security",
  },
]

export default function HomeServices() {
  const t = useTranslations("HomePage")
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <div ref={ref} className="w-full pb-10 px-10">
      <motion.h1
        className="text-3xl font-bold text-center text-white mt-16"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.7 }}
      >
        {t("ourServices")}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {homeCyberCategories.map((category, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
          >
            <Image
              src={category.image}
              alt={category.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-xl font-bold mt-4">{category.title}</h2>
            <p className="mt-2 mb-4">{category.description}</p>
            <Link
              href={category.link}
              className="mt-8 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700"
            >
              {t("learnMoreCategory")}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
