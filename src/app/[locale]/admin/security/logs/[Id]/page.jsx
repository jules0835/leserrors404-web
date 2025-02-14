import { getLogById } from "@/db/crud/logCrud"
import LogDetails from "@/features/admin/security/logs/LogDetails"

export default async function LogPage({ params }) {
  const { log } = await getLogById(params.Id)

  if (!log) {
    return <div>Log not found</div>
  }

  const plainLog = JSON.parse(JSON.stringify(log))

  return (
    <div>
      <LogDetails log={plainLog} />
    </div>
  )
}
