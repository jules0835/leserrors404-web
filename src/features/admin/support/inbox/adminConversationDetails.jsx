"use client"
import { formatDistanceToNow, format } from "date-fns"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  Package,
  CreditCard,
  ShoppingBag,
  MessageSquareOff,
  ChevronRight,
  UserRoundPlus,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAdminChat } from "@/features/admin/support/context/adminChatContext"
import { AnimatedReload } from "@/components/actions/AnimatedReload"
import { useState } from "react"
import { useRouter } from "@/i18n/routing"

export default function AdminConversationDetails({ chat }) {
  const t = useTranslations("Admin.Chat")
  const [isEndingChatPopup, setIsEndingChatPopup] = useState(false)
  const { endChat, isEndingChat } = useAdminChat()
  const firstMessageDate = new Date(chat.messages[0].sendDate)
  const messageCount = chat.messages.length
  const user = chat.user || {}
  const router = useRouter()
  const handleEndChat = async () => {
    await endChat()
    setIsEndingChatPopup(false)
  }

  return (
    <div className="w-80 border-l bg-muted/30 lg:block overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg">{t("conversationDetails")}</h3>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback>
                {chat.user && (
                  <div>
                    {user.firstName?.[0].toUpperCase()}
                    {user.lastName?.[0].toUpperCase()}
                  </div>
                )}
                {!chat.user && <div>{chat.userName?.[0].toUpperCase()}</div>}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : `${chat.userName}`}
            </h3>
            <span className="text-sm text-muted-foreground">
              {user.email || t("noEmail")}
            </span>
            {!chat.user && (
              <h1 className="text-sm text-muted-foreground text-red-500">
                {t("userNotLoggedIn")}
              </h1>
            )}
          </div>

          {user._id && (
            <div className="space-y-2">
              <DetailItem
                icon={<Mail size={16} />}
                label={t("email")}
                value={user.email || t("notProvided")}
              />
              <DetailItem
                icon={<Phone size={16} />}
                label={t("phone")}
                value={user.phone || t("notProvided")}
              />
              {user.address && (
                <DetailItem
                  icon={<MapPin size={16} />}
                  label={t("location")}
                  value={`${user.address.city}, ${user.address.country}`}
                />
              )}
              <DetailItem
                icon={<ShoppingBag size={16} />}
                label={t("company")}
                value={user.company || t("notProvided")}
              />
            </div>
          )}
        </div>

        {chat.user && (
          <div className="space-y-2 w-full">
            <h4 className="font-medium">{t("userActions")}</h4>
            <Button variant="outline" size="icon" className="w-full">
              <UserRoundPlus
                size={16}
                onClick={() =>
                  router.push(`/admin/business/customers/${chat.user._id}`)
                }
              />
              {t("userProfile")}
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" size="icon" className="w-full">
              <Package size={16} />
              {t("userOrders")}
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" size="icon" className="w-full">
              <CreditCard size={16} />
              {t("userSubscriptions")}
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">{t("conversationStats")}</h4>
          <DetailItem
            icon={<Calendar size={16} />}
            label={t("started")}
            value={formatDistanceToNow(firstMessageDate, { addSuffix: true })}
          />
          <DetailItem
            icon={<Tag size={16} />}
            label={t("totalMessages")}
            value={messageCount.toString()}
          />
          <DetailItem
            icon={<AlertCircle size={16} />}
            label={t("status")}
            value={chat.isActive ? t("active") : t("closed")}
          />
          {chat.endedAt && (
            <DetailItem
              icon={<Calendar size={16} />}
              label={t("ended")}
              value={format(new Date(chat.endedAt), "PPP")}
            />
          )}
        </div>

        {(chat.orders?.length > 0 ||
          chat.subscriptions?.length > 0 ||
          chat.products?.length > 0) && (
          <div className="space-y-2">
            <h4 className="font-medium">{t("relatedItems")}</h4>

            {chat.orders?.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package size={14} /> {t("orders")}:
                </span>
                <div className="pl-5 space-y-1">
                  {chat.orders.map((order, index) => (
                    <div
                      key={index}
                      className="text-sm bg-muted/50 p-1 rounded"
                    >
                      {t("order")} #{order.toString().slice(-6)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chat.subscriptions?.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CreditCard size={14} /> {t("subscriptions")}:
                </span>
                <div className="pl-5 space-y-1">
                  {chat.subscriptions.map((sub, index) => (
                    <div
                      key={index}
                      className="text-sm bg-muted/50 p-1 rounded"
                    >
                      {t("subscription")} #{sub.toString().slice(-6)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chat.products?.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <ShoppingBag size={14} /> {t("products")}:
                </span>
                <div className="pl-5 space-y-1">
                  {chat.products.map((product, index) => (
                    <div
                      key={index}
                      className="text-sm bg-muted/50 p-1 rounded"
                    >
                      {t("product")} #{product.toString().slice(-6)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {chat.adminSummary && (
          <div className="space-y-2">
            <h4 className="font-medium">{t("adminSummary")}</h4>
            <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
              {chat.adminSummary}
            </p>
          </div>
        )}
      </div>

      {chat.isActive && (
        <div className="p-4 border-t">
          <Dialog open={isEndingChatPopup} onOpenChange={setIsEndingChatPopup}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <MessageSquareOff className="mr-2 h-4 w-4" />
                {t("endChat.titleBtn")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("endChat.title")}</DialogTitle>
                <DialogDescription>
                  {t("endChat.description")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEndingChatPopup(false)}
                >
                  {t("endChat.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEndChat}
                  disabled={isEndingChat}
                >
                  {isEndingChat ? (
                    <div className="flex items-center gap-2">
                      <AnimatedReload />
                    </div>
                  ) : (
                    t("endChat.confirm")
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm">
        <span className="text-muted-foreground">{label}:</span> {value}
      </span>
    </div>
  )
}
