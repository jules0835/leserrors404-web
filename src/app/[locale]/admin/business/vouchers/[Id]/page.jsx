import VoucherDetails from "@/features/admin/business/vouchers/voucherDetails"

export default function VoucherPage({ params }) {
  const { Id: voucherId } = params

  return <VoucherDetails voucherId={voucherId} />
}
