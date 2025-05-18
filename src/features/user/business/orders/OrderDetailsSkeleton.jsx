import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
export default function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1"
            >
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
