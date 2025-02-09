import { Skeleton } from "@/components/ui/skeleton"

export default function DataGridSkeleton({ cells = 1, rows = 1 }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center space-x-4 w-full">
          {Array.from({ length: cells }).map((_, cellIndex) => (
            <Skeleton key={cellIndex} className="h-4  rounded-sm w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
