/* eslint-disable max-params */
"use client"
import { company, webAppSettings } from "@/assets/options/config"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState, useEffect } from "react"
import animation from "@/assets/images/lockAnnimation.gif"
import { TypeAnimation } from "react-type-animation"
import { Link } from "@/i18n/routing"
import { useInView } from "react-intersection-observer"

export default function HomeWelcome({ animationReverse, isLoggedIn }) {
  const t = useTranslations("HomePage")
  const [reverse, setReverse] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true })
  const wordsToSecure = [
    t("business"),
    t("data"),
    t("privacy"),
    t("customers"),
    t("employees"),
  ]

  useEffect(() => {
    if (!animationReverse || isLoggedIn || !inView) {
      return undefined
    }

    const timer = setTimeout(() => {
      setReverse(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [animationReverse, isLoggedIn, inView])
  const getAnimationState = (
    inViewData,
    reverseData,
    initialState,
    finalState
  ) => {
    if (!inViewData) {
      return {}
    }

    return reverseData ? initialState : finalState
  }

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center md:w-1/2 md:pt-0 pb-10 pt-10"
    >
      {animationReverse && !isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src={animation}
            alt="Cyna Animation"
            width={430}
            height={40}
            className="rounded-full -mt-80"
          />
        </motion.div>
      )}
      {!animationReverse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={getAnimationState(
            inView,
            reverse,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1 }
          )}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src={webAppSettings.images.logoNoTextUrl}
            alt="Cyna Logo"
            width={100}
            height={100}
            className="rounded-full bg-white p-4 mb-4"
          />
        </motion.div>
      )}
      <motion.h1
        className="text-5xl font-bold text-center text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={getAnimationState(
          inView,
          reverse,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0 }
        )}
        transition={{ duration: 1, delay: 0.4 }}
      >
        {animationReverse
          ? t("welcome", { company: company.name })
          : `${company.name}`}
      </motion.h1>
      {animationReverse && !isLoggedIn && (
        <motion.p
          className="mt-4 text-xl text-center text-white font-semibold"
          initial={{ opacity: 0, y: 50 }}
          animate={getAnimationState(
            inView,
            reverse,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0 }
          )}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t("welcomeMessageAnimation")}
        </motion.p>
      )}
      {!animationReverse && (
        <div>
          <motion.p
            className="mt-4 text-2xl text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={getAnimationState(
              inView,
              reverse,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0 }
            )}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t("welcomeMessage")}
          </motion.p>
          <motion.p
            className="mt-1 text-xl text-center text-white md:mx-20 mx-5 h-16"
            initial={{ opacity: 0, y: 50 }}
            animate={getAnimationState(
              inView,
              reverse,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0 }
            )}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {t("welcomeMessageDescription")}{" "}
            <TypeAnimation
              sequence={wordsToSecure.flatMap((word) => [word, 2000])}
              wrapper="span"
              cursor={true}
              className="text-xl font-bold text-white"
              repeat={Infinity}
            />
          </motion.p>
          {!isLoggedIn && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={getAnimationState(
                inView,
                reverse,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0 }
              )}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link
                className="rounded-lg bg-white text-indigo-600 p-2 px-4 mr-4  hover:bg-gray-200"
                href="/auth/register"
              >
                {t("register")}
              </Link>
              <Link
                className="rounded-lg bg-indigo-800 text-white p-2 px-4 hover:bg-indigo-700"
                href="/auth/login"
              >
                {t("login")}
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
