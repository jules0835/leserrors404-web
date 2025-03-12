import VoucherDetails from "@/features/admin/business/vouchers/voucherDetails"

export default function VoucherPage({ params }) {
  return <VoucherDetails voucherId={params.Id} />
}
