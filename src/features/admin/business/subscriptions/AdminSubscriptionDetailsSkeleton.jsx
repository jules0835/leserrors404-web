"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function AdminSubscriptionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
            <Button variant="destructive" size="sm" disabled>
              <Skeleton className="h-4 w-24" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center border-b pb-4">
              <div className="border-r pr-4">
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="flex justify-between items-center w-full ml-4">
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
