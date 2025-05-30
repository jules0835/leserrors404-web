"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function AdminOrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
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
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16 mt-1 sm:mt-0" />
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20 mt-1 sm:mt-0" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4"
            >
              <div>
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <Skeleton className="h-5 w-16 mb-2" />
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
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center border-b pb-4"
            >
              <div className="border-r pr-4 mb-2 sm:mb-0">
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full ml-0 sm:ml-4">
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right mt-2 sm:mt-0">
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
