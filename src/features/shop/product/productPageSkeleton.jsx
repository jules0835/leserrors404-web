import { Skeleton } from "@/components/ui/skeleton"

export default function ProductPageSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="mt-4 flex justify-center">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6" />
            </div>

            <div className="flex items-baseline gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-7 w-40" />
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="p-6 border rounded-xl shadow-sm bg-white">
            <Skeleton className="h-8 w-40 mb-6" />

            <Skeleton className="h-16 w-full mb-6" />

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-5 w-20" />
              <div className="flex items-center border rounded-md overflow-hidden">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
