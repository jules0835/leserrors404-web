import { Skeleton } from "@/components/ui/skeleton"

export default function GridProductsSkeleton({ cells = 1, rows = 1 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {Array.from({ length: rows * cells }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 w-full bg-white">
          <div className="mb-4">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="flex justify-start mb-4">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="mb-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
