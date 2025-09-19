"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"
import { useVerifyOTP, useSendOTP } from "@/hooks/useEmailVerification"

interface EmailVerificationProps {
  email: string
  onVerified: () => void
  // onBack: () => void
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [otp, setOtp] = useState("")
  const [lastSentTime, setLastSentTime] = useState(Date.now())

  const verifyMutation = useVerifyOTP(onVerified)
  const sendMutation = useSendOTP(() => setLastSentTime(Date.now()))

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      showToast.error("Please enter a valid 6-digit OTP")
      return
    }
    verifyMutation.mutate({ email, otp })
  }

  const canResend = () => {
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() - lastSentTime >= fiveMinutes
  }

  const getRemainingTime = () => {
    const fiveMinutes = 5 * 60 * 1000
    const elapsed = Date.now() - lastSentTime
    const remaining = Math.max(0, fiveMinutes - elapsed)
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleResendOTP = () => {
    sendMutation.mutate(email)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit code to {email}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={verifyMutation.isPending || otp.length !== 6}>
            {verifyMutation.isPending ? (
              <>
                <Shield className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOTP}
              disabled={sendMutation.isPending || !canResend()}
              className="text-blue-600"
            >
              {sendMutation.isPending ? "Sending..." : canResend() ? "Resend OTP" : getRemainingTime()}
            </Button>
          </div>

          {/* <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Back to Registration
          </Button> */}
        </form>
      </CardContent>
    </Card>
  )
}