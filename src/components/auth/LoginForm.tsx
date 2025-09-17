"use client"

import type React from "react"
import { useState } from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToast } from "@/components/ui/toast-helper"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        showToast.success("Login successful!", "Welcome back to Medynx.")

        let dashboardUrl
        if (data.user.role === "admin") {
          dashboardUrl = "/dashboard/admin"
        } else if (data.user.role === "doctor") {
          dashboardUrl = data.user.isActive ? "/dashboard/doctor" : "/dashboard/doctor/pending"
        } else {
          dashboardUrl = "/dashboard/patient"
        }
        
        window.location.href = dashboardUrl
      } else {
        if (data.pending) {
          showToast.info("Account Pending Approval", data.message)
        } else if (data.deactivated) {
          showToast.error("Account Deactivated", data.message)
        } else {
          showToast.error("Login failed", data.message || "Invalid credentials")
        }
      }
    } catch {
      showToast.error("Error", "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white relative overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="subtle-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.5"/>
              <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtle-dots)"/>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          {/* <motion.div 
            className="flex items-center space-x-4 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medynx</h1>
              <p className="text-blue-600 font-medium">Healthcare Platform</p>
            </div>
          </motion.div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Welcome back</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  />
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent flex items-center justify-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <p className="text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              </motion.div>

              {/* Demo Accounts */}
              {/* <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <h3 className="text-sm font-bold text-gray-900 mb-4">Demo Accounts:</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><strong className="text-blue-600">Admin:</strong> admin@Medynx.com / password123</p>
                  <p><strong className="text-teal-600">Doctor:</strong> doctor@Medynx.com / password123</p>
                  <p><strong className="text-green-600">Patient:</strong> patient@Medynx.com / password123</p>
                </div>
              </motion.div> */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoginForm