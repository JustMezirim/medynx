import { useMutation } from "@tanstack/react-query"
import { adminUsersApi, type CreateUserData, type UpdateDoctorData, type UpdatePatientData } from "@/lib/api/admin/users"
import { showToast } from "@/components/ui/toast-helper"

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserData) => adminUsersApi.createUser(userData),
    onSuccess: (_, variables) => {
      const userType = variables.role === "doctor" ? "Doctor" : "Patient"
      showToast.success(`${userType} created successfully`)
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to create user")
    },
  })
}

export const useUpdateDoctor = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoctorData }) => 
      adminUsersApi.updateDoctor(id, data),
    onSuccess: () => {
      showToast.success("Doctor updated successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to update doctor")
    },
  })
}

export const useUpdatePatient = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientData }) => 
      adminUsersApi.updatePatient(id, data),
    onSuccess: () => {
      showToast.success("Patient updated successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to update patient")
    },
  })
}