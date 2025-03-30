import { Skeleton } from "@/components/ui/skeleton"

export default function AdminInboxSkeleton() {
  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col h-full">
        <div className="px-4 h-16 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  i % 2 === 0
                    ? "bg-blue-200 rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                <Skeleton className="h-4 w-48 mb-2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 h-16 border-t">
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-10" />
          </div>
        </div>
      </div>

      <div className="w-80 border-l bg-muted/30 hidden lg:block overflow-y-auto">
        <div className="px-4 h-16 border-b flex items-center">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-6 w-32 mt-2" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <div className="pl-5 space-y-1">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 h-16 border-t">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
