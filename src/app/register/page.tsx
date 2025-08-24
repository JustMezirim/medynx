"use client"

import AuthBackground from "@/components/auth/AuthBackground"
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <AuthBackground type="register" width="w-3/5" />
      <RegisterForm />
    </div>
  )
}