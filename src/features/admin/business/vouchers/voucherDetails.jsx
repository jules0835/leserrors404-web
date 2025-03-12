"use client"
import { useQuery } from "@tanstack/react-query"
import DataGridSkeleton from "@/components/skeleton/DataGridSkeleton"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ListSkeleton from "@/components/skeleton/ListSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function VoucherDetails({ voucherId }) {
  const {
    data: voucher,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["voucherDetails", voucherId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/business/vouchers/${voucherId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch voucher details")
      }

      return response.json()
    },
  })
  const handleChangeVoucherStatus = async () => {
    try {
      const response = await fetch(
        `/api/admin/business/vouchers/${voucherId}`,
        {
          method: "PUT",
          body: JSON.stringify({ isActive: !voucher.isActive }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to change voucher status")
      }

      toast.success("Voucher status changed successfully")
      refetch()
    } catch (changeStatusError) {
      toast.error("Failed to change voucher status")
    }
  }

  return (
    <div className="">
      {isLoading && (
        <div className="w-full">
          <Skeleton className="h-10 w-40" />
          <ListSkeleton rows={2} parts={4} height={20} px={2} />
        </div>
      )}
      {error && <div>Failed to load voucher details</div>}
      {voucher && (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleChangeVoucherStatus}
            className={`mt-4 ${voucher.isActive ? "text-red-700" : "text-green-700"}`}
          >
            {voucher.isActive ? "Deactivate Voucher" : "Activate Voucher"}
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Code</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.code}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.type}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.amount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Minimum Purchase Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.minPurchaseAmount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{voucher.isActive ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Created At</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{new Date(voucher.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Updated At</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{new Date(voucher.updatedAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {!isLoading && !error && !voucher && (
        <div>No voucher details available</div>
      )}
    </div>
  )
}
