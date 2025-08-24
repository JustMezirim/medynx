"use client"

import AuthBackground from "@/components/auth/AuthBackground"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <AuthBackground type="login" width="w-3/5" />
      <LoginForm />
    </div>
  )
}