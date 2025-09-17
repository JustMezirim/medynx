"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthBackground from "@/components/auth/AuthBackground"
import RegisterForm from "@/components/auth/RegisterForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function RegisterPage() {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)
  const router = useRouter()

  // Fetch replaced with React Query

  if (isAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAllowed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Registration Disabled</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              New user registration is currently disabled. Please contact support for assistance.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <AuthBackground type="register" width="w-3/5" />
      <RegisterForm />
    </div>
  )
}