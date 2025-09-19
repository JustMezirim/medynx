import { useMutation, useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { showToast } from "@/components/ui/toast-helper"

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authApi.login(email, password),
    onSuccess: (data: { user: { role: string } }) => {
      showToast.success("Login successful!", "Welcome back to Medynx.")
      
      let dashboardUrl
      if (data.user.role === "admin") {
        dashboardUrl = "/dashboard/admin"
      } else if (data.user.role === "doctor") {
        dashboardUrl = "/dashboard/doctor"
      } else {
        dashboardUrl = "/dashboard/patient"
      }
      
      window.location.href = dashboardUrl
    },
    onError: (error: unknown) => {
      // Handle email verification error
      const errorObj = error as { emailNotVerified?: boolean; message?: string; email?: string }
      if (errorObj.emailNotVerified || errorObj.message?.includes('verify your email')) {
        showToast.error("Email not verified", "Please verify your email before logging in.")
        setTimeout(() => {
          window.location.href = `/verify-email?email=${encodeURIComponent(errorObj.email || '')}`
        }, 4000) // Wait 4 seconds for toast to be visible
        return
      }
      showToast.error("Login failed", errorObj.message || "Invalid credentials")
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => authApi.register(formData),
    onSuccess: () => {
      showToast.success("Registration successful!", "Please login with your credentials.")
    },
    onError: (error: Error) => {
      showToast.error("Registration failed", error.message || "Something went wrong")
    },
  })
}

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: () => authApi.getSpecializations(),
  })
}