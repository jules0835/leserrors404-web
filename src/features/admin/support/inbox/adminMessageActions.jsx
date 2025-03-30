import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TableOfContents,
  Link,
  Package,
  CreditCard,
  ShoppingBag,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminMessageActions({ onSendAction }) {
  const [selectedAction, setSelectedAction] = useState("link")
  const [link, setLink] = useState("")
  const [linkMessage, setLinkMessage] = useState("")
  const [linkType, setLinkType] = useState("internal")
  const [needLogin, setNeedLogin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Admin.Chat")
  const handleSendAction = () => {
    if (selectedAction === "link" && link) {
      if (!linkMessage.trim()) {
        return
      }

      onSendAction({
        type: "link",
        data: {
          message: linkMessage,
          link,
          linkType,
          linkNeedLogin: needLogin,
        },
      })
      setLink("")
      setLinkMessage("")
      setLinkType("internal")
      setNeedLogin(false)
      setIsOpen(false)
    } else {
      onSendAction({
        type: "action",
        data: {
          isAction: true,
          action: selectedAction,
        },
      })
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <TableOfContents className="h-6 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">{t("selectAction")}</h4>
            <Select
              value={selectedAction}
              onValueChange={(value) => setSelectedAction(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">
                  <div className="flex items-center">
                    <Link className="w-4 h-4 mr-2" />
                    {t("sendLink")}
                  </div>
                </SelectItem>
                <SelectItem value="SELECT_ORDER">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    {t("selectOrder")}
                  </div>
                </SelectItem>
                <SelectItem value="SELECT_SUBSCRIPTION">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t("selectSubscription")}
                  </div>
                </SelectItem>
                <SelectItem value="SELECT_PRODUCT">
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t("selectProduct")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedAction === "link" && (
            <div className="space-y-2">
              <Input
                placeholder={t("enterLinkMessage")}
                value={linkMessage}
                onChange={(e) => setLinkMessage(e.target.value)}
              />
              <Input
                placeholder={t("enterLink")}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <Select value={linkType} onValueChange={setLinkType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">{t("internalLink")}</SelectItem>
                  <SelectItem value="external">{t("externalLink")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="needLogin"
                  checked={needLogin}
                  onChange={(e) => setNeedLogin(e.target.checked)}
                />
                <label htmlFor="needLogin">{t("requireLogin")}</label>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSendAction}
            disabled={
              selectedAction === "link" && (!link || !linkMessage.trim())
            }
          >
            {t("send")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
