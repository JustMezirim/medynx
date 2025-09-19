import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminSettingsApi, type AdminProfile, type NewAdmin, type NewSpecialization } from "@/lib/api/admin/admin-settings"
import { showToast } from "@/components/ui/toast-helper"

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => adminSettingsApi.getProfile(),
  })
}

export const useUpdateAdminProfile = () => {
  return useMutation({
    mutationFn: (profile: AdminProfile) => adminSettingsApi.updateProfile(profile),
    onSuccess: () => {
      showToast.success("Profile updated successfully")
    },
    onError: () => {
      showToast.error("Failed to update profile")
    },
  })
}

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: () => adminSettingsApi.getSpecializations(),
  })
}

export const useAddSpecialization = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (specialization: NewSpecialization) => adminSettingsApi.addSpecialization(specialization),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] })
      showToast.success("Specialization added successfully")
    },
    onError: () => {
      showToast.error("Failed to add specialization")
    },
  })
}

export const useAddAdmin = () => {
  return useMutation({
    mutationFn: (admin: NewAdmin) => adminSettingsApi.addAdmin(admin),
    onSuccess: () => {
      showToast.success("Admin added successfully")
    },
    onError: () => {
      showToast.error("Failed to add admin")
    },
  })
}