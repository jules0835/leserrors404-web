import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { Formik, Form, Field, ErrorMessage } from "formik"
import toast from "react-hot-toast"
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getVoucherSchema } from "@/features/admin/business/vouchers/utils/voucher"

export default function NewVoucher({ onVoucherCreated }) {
  const t = useTranslations("Admin.Business.Vouchers")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const VoucherSchema = getVoucherSchema(t)
  const initialValues = {
    code: "",
    type: "",
    amount: 1,
    minPurchaseAmount: 0,
    description: "",
    isSingleUse: false,
  }
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("/api/admin/business/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const result = await response.json()

      if (response.ok) {
        toast.success(t("voucherCreated"))
        setIsDialogOpen(false)
        onVoucherCreated()
      } else {
        toast.error(result.error || t("voucherCreationFailed"))
        setErrors({ api: result.error })
      }
    } catch (error) {
      toast.error(t("voucherCreationFailed"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          {t("addVoucher")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("addVoucher")}</DialogTitle>
          <DialogDescription>{t("addVoucherDescription")}</DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={VoucherSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label>{t("voucherCode")}</Label>
                <Field name="code" as={Input} />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
                <div className="text-gray-500 text-sm mt-1">
                  {t("autoGenerateCodeMessage")}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("voucherType")}</Label>
                <Select
                  name="type"
                  onValueChange={(value) => setFieldValue("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("voucherType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percentage">
                        {t("percentage")}
                      </SelectItem>
                      <SelectItem value="fixed">{t("fixed")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("voucherAmount")}</Label>
                <Field name="amount" type="number" as={Input} />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("minPurchaseAmount")}</Label>
                <Field name="minPurchaseAmount" type="number" as={Input} />
                <ErrorMessage
                  name="minPurchaseAmount"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("description")}</Label>
                <Field name="description" as={Input} />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Field type="checkbox" name="isSingleUse" id="isSingleUse" />
                  <Label htmlFor="isSingleUse">{t("singleUseVoucher")}</Label>
                </div>
                <ErrorMessage
                  name="isSingleUse"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {t("saveChanges")}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
