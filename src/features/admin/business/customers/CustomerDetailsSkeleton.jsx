"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CustomerDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-40 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
