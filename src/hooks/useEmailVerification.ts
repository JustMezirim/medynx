import { useMutation } from "@tanstack/react-query"
import { verifyOTP, sendOTP } from "@/lib/api/auth"
import { showToast } from "@/components/ui/toast-helper"

export const useVerifyOTP = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      showToast.success("Email verified successfully!")
      onSuccess()
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Invalid OTP")
    }
  })
}

export const useSendOTP = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      showToast.success("OTP sent successfully!")
      onSuccess()
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to resend OTP")
    }
  })
}