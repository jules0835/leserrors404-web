"use client"
import { useTranslations } from "next-intl"
import {
  getLogLevelTitle,
  getLogKeyTitle,
  returnIconLogLevel,
} from "@/features/admin/security/logs/utils/logs"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "@/i18n/routing"

export default function LogDetails({ log }) {
  const t = useTranslations("Admin.Security.Logs")
  const router = useRouter()

  return (
    <div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>{t("logId")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log._id}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>{t("logDate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{new Date(log.date).toLocaleString("fr-FR")}</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>{t("author")}</CardTitle>
          </CardHeader>
          <CardContent>
            {log.authorName ? (
              <div className="flex items-center justify-center">
                <p className="px-2">{log.authorName}</p>
                <ExternalLink
                  size={12}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/security/users/${log.authorId}`)
                  }
                />
              </div>
            ) : (
              <p>{log.authorId}</p>
            )}
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>{t("user")}</CardTitle>
          </CardHeader>
          <CardContent>
            {log.userName ? (
              <div className="flex items-center justify-center">
                <p className="px-2">{log.userName}</p>
                <ExternalLink
                  size={12}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/security/users/${log.userId}`)
                  }
                />
              </div>
            ) : (
              <p>{log.userId}</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("logLevel")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            {returnIconLogLevel(log.logLevel)}
            <p className="ml-3">{getLogLevelTitle(log.logLevel, t)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("logKey")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{getLogKeyTitle(log.logKey, t)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("isError")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log.isError ? t("yes") : t("no")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("isAdminAction")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log.isAdminAction ? t("yes") : t("no")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("deviceType")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{log.deviceType}</p>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("message")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-40">
            <p>{log.message}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("technicalMessage")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-40">
            <p>{log.technicalMessage}</p>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("data")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-40">
            <p>{JSON.stringify(log.data)}</p>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("oldData")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-40">
            <p>{JSON.stringify(log.oldData)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("newData")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-40">
            <p>{JSON.stringify(log.newData)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
