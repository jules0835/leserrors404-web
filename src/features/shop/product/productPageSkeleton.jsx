import { Skeleton } from "@/components/ui/skeleton"

export default function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
              <div className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm">
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-3/4" />
              </div>
              <Skeleton className="h-6 w-full mt-1" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>

            <div className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="border rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-baseline">
                    <Skeleton className="h-6 w-24" />
                    <div>
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-20" />
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-20" />
                        <div className="text-right">
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-5 w-28" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="gap-6">
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <Skeleton className="h-8 w-8 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <Skeleton className="w-full aspect-video rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
