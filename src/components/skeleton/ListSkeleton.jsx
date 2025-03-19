import { Skeleton } from "@/components/ui/skeleton"

export default function ListSkeleton({
  rows = 5,
  px = 4,
  parts = 1,
  height = 4,
  mt = 4,
  gap = 4,
}) {
  return (
    <div className={`w-full`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex items-center mt-${mt} w-full px-${px} mb-4 gap-${gap}`}
        >
          {Array.from({ length: parts }).map((__, cellIndex) => (
            <Skeleton
              key={cellIndex}
              className={`h-${height} rounded-sm w-full `}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
