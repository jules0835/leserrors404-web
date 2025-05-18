import { Skeleton } from "@/components/ui/skeleton"

export default function CarouselSkeletonEditor() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 border border-gray-200 p-4 rounded-lg mt-5">
      <Skeleton className="h-48 w-full md:h-20 md:w-36 rounded-lg" />
      <div className="w-full md:w-auto space-y-4">
        <div className="space-y-2 text-center md:text-left">
          <Skeleton className="h-4 w-[100px] mx-auto md:mx-0" />
          <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <Skeleton className="h-4 w-[100px] mx-auto md:mx-0" />
          <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <Skeleton className="h-4 w-[100px] mx-auto md:mx-0" />
          <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <Skeleton className="h-4 w-[100px] mx-auto md:mx-0" />
          <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
        </div>
      </div>
    </div>
  )
}
