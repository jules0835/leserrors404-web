import { useState } from "react"
import { AlertCircle, Info, AlertTriangle, Tag } from "lucide-react"
import { useLocale } from "next-intl"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const styleConfig = {
  info: {
    icon: Info,
    textColor: "text-white",
    borderColor: "border-blue-400",
    shadowColor: "shadow-blue-900/20",
  },
  promo: {
    icon: Tag,
    textColor: "text-white",
    borderColor: "border-green-400",
    shadowColor: "shadow-green-900/20",
  },
  warning: {
    icon: AlertTriangle,
    textColor: "text-white",
    borderColor: "border-yellow-400",
    shadowColor: "shadow-yellow-900/20",
  },
  error: {
    icon: AlertCircle,
    textColor: "text-white",
    borderColor: "border-red-400",
    shadowColor: "shadow-red-900/20",
  },
}

export default function HomeBanner({ initialBannerData }) {
  const [bannerData] = useState(JSON.parse(initialBannerData))
  const locale = useLocale()
  const { ref, inView } = useInView({ triggerOnce: true })

  if (!bannerData || !bannerData.isActive) {
    return null
  }

  const style = styleConfig[bannerData.style] || styleConfig.info
  const Icon = style.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
      className="w-full flex justify-center px-4 py-2"
    >
      <div
        className={`${style.borderColor} ${style.shadowColor} border-2 rounded-lg shadow-sm max-w-3xl w-full bg-black/20 backdrop-blur-sm`}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center py-2 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`${style.textColor} flex-shrink-0 mr-3 fixed left-5`}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex-1 text-center"
          >
            <h3 className={`${style.textColor} text-sm font-bold`}>
              {bannerData.titleTrans[locale] || ""}
            </h3>
            {bannerData.descriptionTrans[locale] && (
              <div className={`${style.textColor} mt-1 text-sm`}>
                {bannerData.descriptionTrans[locale]}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
