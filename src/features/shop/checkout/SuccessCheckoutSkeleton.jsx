"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SuccessCheckoutSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <Skeleton className="h-9 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-5 w-56" />
            </div>
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Skeleton className="h-7 w-32 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Skeleton className="h-11 w-44 mx-auto" />
      </div>
    </div>
  )
}
