"use client"
import { UserProfileForm } from "@/features/user/profile/userProfileForm"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch(`/api/user/dashboard/profile`)

      return response.json()
    },
  })

  if (error) {
    return <div>{error.message}</div>
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-10">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <UserProfileForm user={user} />
    </div>
  )
}
