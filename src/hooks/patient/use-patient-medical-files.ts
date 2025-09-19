import { useQuery, useMutation } from "@tanstack/react-query"
import { patientMedicalFilesApi, type MedicalFileFilters } from "@/lib/api/patient/medical-files"
import { showToast } from "@/components/ui/toast-helper"

export const usePatientMedicalFiles = (filters?: MedicalFileFilters) => {
  return useQuery({
    queryKey: ["patient-medical-files", filters],
    queryFn: () => patientMedicalFilesApi.getMedicalFiles(filters),
  })
}

export const useDownloadMedicalFile = () => {
  return useMutation({
    mutationFn: (fileId: string) => patientMedicalFilesApi.downloadFile(fileId),
    onSuccess: () => {
      showToast.success("File downloaded successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to download file")
    },
  })
}