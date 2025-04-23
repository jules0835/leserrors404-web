import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

export default function PeriodFilter({ value, onChange, showGroupBy = true }) {
  const t = useTranslations("Admin.Stats")

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <Select
        value={value.period}
        onValueChange={(val) => onChange({ ...value, period: val })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("period")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">{t("periods.7d")}</SelectItem>
          <SelectItem value="30d">{t("periods.30d")}</SelectItem>
          <SelectItem value="90d">{t("periods.90d")}</SelectItem>
        </SelectContent>
      </Select>

      {showGroupBy && (
        <Select
          value={value.groupBy}
          onValueChange={(val) => onChange({ ...value, groupBy: val })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("groupBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">{t("groupByOptions.day")}</SelectItem>
            <SelectItem value="week">{t("groupByOptions.week")}</SelectItem>
            <SelectItem value="month">{t("groupByOptions.month")}</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
