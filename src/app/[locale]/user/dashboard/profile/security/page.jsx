import { useTranslations } from "next-intl"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import OtpConfig from "@/features/user/security/otp/OtpConfig"
import UserChangePassword from "@/features/user/security/password/userChangePassword"

export default function Page() {
  const t = useTranslations("User.Security")

  return (
    <div className="h-screen">
      <Accordion type="single" collapsible>
        <AccordionItem value="password">
          <AccordionTrigger>
            <h2 className="text-lg font-semibold">{t("password")}</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-5">
              <UserChangePassword />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="two-factor-auth">
          <AccordionTrigger>
            <h2 className="text-lg font-semibold">{t("twoFactorAuth")}</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-5">
              <OtpConfig />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
