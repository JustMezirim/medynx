import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientProfileApi, type UpdateProfileData } from "@/lib/api/patient/profile"
import { showToast } from "@/components/ui/toast-helper"

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => patientProfileApi.getProfile(),
  })
}

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateProfileData) => patientProfileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] })
      showToast.success("Profile updated successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to update profile")
    },
  })
}