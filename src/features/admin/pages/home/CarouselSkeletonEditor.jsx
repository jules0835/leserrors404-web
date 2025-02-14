import { Skeleton } from "@/components/ui/skeleton"

export default function CarouselSkeletonEditor() {
  return (
    <div className="flex items-center space-x-4 border border-gray-200 p-4 rounded-lg mt-5">
      <Skeleton className="h-20 w-36 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  )
}
