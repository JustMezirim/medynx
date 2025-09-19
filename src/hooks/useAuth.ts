import { useMutation, useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { showToast } from "@/components/ui/toast-helper"

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authApi.login(email, password),
    onSuccess: (data) => {
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
    onError: (error: Error) => {
      showToast.error("Login failed", error.message || "Invalid credentials")
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