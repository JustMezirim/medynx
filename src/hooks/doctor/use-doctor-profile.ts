import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doctorProfileApi, type UpdateProfileData } from "@/lib/api/doctor/doctor-profile"
import { showToast } from "@/components/ui/toast-helper"

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: ["doctor-profile"],
    queryFn: () => doctorProfileApi.getProfile(),
  })
}

export const useDoctorStats = () => {
  return useQuery({
    queryKey: ["doctor-stats"],
    queryFn: () => doctorProfileApi.getStats(),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => doctorProfileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] })
      showToast.success("Profile updated successfully")
    },
    onError: () => {
      showToast.error("Failed to update profile")
    },
  })
}