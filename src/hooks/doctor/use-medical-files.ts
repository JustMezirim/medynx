import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { medicalFilesApi, type UploadMedicalFileData } from "@/lib/api/doctor/medical-files"
import { showToast } from "@/components/ui/toast-helper"

export const useMedicalFiles = (category?: string) => {
  return useQuery({
    queryKey: ["medical-files", category],
    queryFn: () => medicalFilesApi.getFiles({ category }),
  })
}

export const useUploadMedicalFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UploadMedicalFileData) => medicalFilesApi.uploadFile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-files"] })
      showToast.success("Medical file uploaded successfully")
    },
    onError: () => {
      showToast.error("Failed to upload medical file")
    },
  })
}

export const useDeleteMedicalFile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => medicalFilesApi.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-files"] })
      showToast.success("Medical file deleted successfully")
    },
    onError: () => {
      showToast.error("Failed to delete medical file")
    },
  })
}