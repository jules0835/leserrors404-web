import { Skeleton } from "@/components/ui/skeleton"

export default function ListSkeleton({
  rows = 5,
  px = 4,
  parts = 1,
  height = 4,
  gapY = 8,
}) {
  return (
    <div className={`w-full`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex items-center mt-10 space-x-${px} w-full`}
        >
          {Array.from({ length: parts }).map((__, cellIndex) => (
            <Skeleton
              key={cellIndex}
              className={`h-${height} rounded-sm w-full my-${gapY}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
