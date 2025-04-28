import { useTranslations } from "next-intl"
import { useChat } from "@/features/contact/chatbot/context/chatContext"
import DButton from "@/components/ui/DButton"
import { BotMessageSquare } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

export default function WelcomeMessage() {
  const t = useTranslations("Contact.Chatbot")
  const { startChat } = useChat()
  const { data: session } = useSession()
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const isMobileApp = searchParams.get("isAppMobile") === "true"
  const handleStartChat = async () => {
    try {
      setIsLoading(true)
      await startChat(formData)
      setIsLoading(false)
    } catch (errorStartChat) {
      setIsLoading(false)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      formData.userName &&
      formData.email &&
      formData.userName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.email.includes("@") &&
      formData.email.includes(".")
    ) {
      handleStartChat()
    } else {
      setError({ message: t("welcome.error.needNameAndEmail") })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center h-full p-4 text-center ${
        isMobileApp ? "h-screen" : ""
      }`}
    >
      <div className="max-w-md flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BotMessageSquare className="w-12 h-12" />
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-semibold mb-4"
        >
          {t("welcome.title")}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          {t("welcome.description")}
        </motion.p>

        {!session?.user ? (
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full space-y-4"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-2"
            >
              <Input
                type="text"
                placeholder={t("welcome.namePlaceholder")}
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="space-y-2"
            >
              <Input
                type="email"
                placeholder={t("welcome.emailPlaceholder")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <DButton
                onClickBtn={handleSubmit}
                isMain
                isLoading={isLoading}
                isDisabled={isLoading}
                className="transition-all duration-200 hover:scale-105"
              >
                {t("welcome.startButton")}
              </DButton>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full"
          >
            <DButton
              onClickBtn={handleStartChat}
              isMain
              isLoading={isLoading}
              isDisabled={isLoading}
              className="transition-all duration-200 hover:scale-105"
            >
              {t("welcome.startButton")}
            </DButton>
          </motion.div>
        )}

        {error && (
          <div>
            <p className="text-red-500 text-sm mb-6">{error.message}</p>
          </div>
        )}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-gray-600 text-sm mb-6"
        >
          {t("welcome.disclaimer")}
        </motion.p>
      </div>
    </motion.div>
  )
}
