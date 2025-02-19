"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LockKeyhole } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export default function OtpConfig() {
  const queryClient = useQueryClient()
  const [otpToken, setOtpToken] = useState("")
  const [otpOpen, setOtpOpen] = useState(false)
  const [error, setError] = useState(null)
  const otpInputRef = useRef(null)
  const t = useTranslations("User.Security.OtpConfig")
  const { data: otpDetails, isLoading } = useQuery({
    queryKey: ["otpDetails"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/security/otp")

      return data
    },
  })
  const generateOtpKeyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/user/security/otp")

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otpDetails"] })
      setOtpOpen(true)
    },
  })
  const verifyOtpMutation = useMutation({
    mutationFn: async (token) => {
      const { data } = await axios.put("/api/user/security/otp", { token })

      if (!data.isOtpValid) {
        throw new Error(data.error || "Invalid OTP CODE")
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otpDetails"] })
      setOtpOpen(false)
      setError(null)
      setOtpToken("")
      otpDetails.isOtpEnabled = true
    },
    onError: (errorVerify) => {
      setError(errorVerify.message)
    },
  })
  const disableOtpMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete("/api/user/security/otp")

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otpDetails"] })
      otpDetails.isOtpEnabled = false
    },
  })
  const handleGenerateOtpKey = () => {
    toast.promise(generateOtpKeyMutation.mutateAsync(), {
      loading: t("loading"),
      success: t("otpGenerated"),
      error: t("otpGenerationFailed"),
    })
  }
  const handleVerifyOtp = () => {
    toast.promise(verifyOtpMutation.mutateAsync(otpToken), {
      loading: t("loading"),
      success: t("otpVerified"),
      error: t("otpVerificationFailed"),
    })
  }
  const handleDisableOtp = () => {
    toast.promise(disableOtpMutation.mutateAsync(), {
      loading: t("loading"),
      success: t("otpDisabled"),
      error: t("otpDisableFailed"),
    })
  }
  const handleCancelOtp = () => {
    setOtpOpen(false)
    setError(null)
    setOtpToken("")
  }

  useEffect(() => {
    if (otpOpen && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [otpOpen])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen -mt-16">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <div className="space-y-4">
          {otpDetails.isOtpEnabled && (
            <div className="space-y-4">
              <p className="text-green-600">{t("otpEnabled")}</p>
              {!otpOpen && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">{t("reconfigureOtp")}</Button>
                  </DialogTrigger>
                  <DialogContent className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        {t("reconfigureOtpTitle")}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {t("reconfigureOtpDescription")}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                      <Button onClick={handleGenerateOtpKey} variant="outline">
                        {t("confirm")}
                      </Button>
                      <Button onClick={handleCancelOtp} variant="outline">
                        {t("cancel")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-500 text-white">
                    {t("disableOtp")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {t("disableOtpTitle")}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      {t("disableOtpDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end space-x-2">
                    <Button
                      onClick={handleDisableOtp}
                      className="border border-red-500 text-red-500"
                    >
                      {t("confirm")}
                    </Button>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border border-gray-300 text-gray-700"
                      >
                        {t("cancel")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          {!otpDetails.isOtpEnabled && !otpOpen && (
            <div className="space-y-4">
              <p className="text-red-600">{t("otpDisabled")}</p>
              {!otpOpen && (
                <Button onClick={handleGenerateOtpKey} variant="outline">
                  {t("enableOtp")}
                </Button>
              )}
            </div>
          )}
          {generateOtpKeyMutation.isSuccess && otpOpen && (
            <div className="space-y-4">
              <p>{t("otpKeyGenerated")} </p>
              <div className="text-gray-800 mb-4">
                {t("scanQrCodeOrEnterCode")}
              </div>
              <div className="flex items-center justify-center space-x-4 w-full">
                <div className="flex flex-col items-center">
                  <Image
                    src={generateOtpKeyMutation.data.qrCodeUrl}
                    alt="QR Code"
                    width={150}
                    height={150}
                    className="mx-auto"
                  />
                </div>
                <Separator orientation="vertical" className="h-32" />
                <div className="flex flex-col items-center">
                  <span className="font-mono">
                    {generateOtpKeyMutation.data.secret
                      .match(/.{1,8}/gu)
                      .map((part, index) => (
                        <div key={index}>{part}</div>
                      ))}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <LockKeyhole size={48} className="text-gray-600" />
                </div>
                <label htmlFor="otp" className="block text-gray-700">
                  {t("enterOtpToken")}
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpToken}
                    onChange={setOtpToken}
                    ref={otpInputRef}
                    className="flex space-x-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-10 h-10 border border-gray-300 rounded-md text-center"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleVerifyOtp} className="mt-4">
                    {t("verifyOtp")}
                  </Button>
                  <Button
                    onClick={handleCancelOtp}
                    variant="outline"
                    className="mt-4"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
