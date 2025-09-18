interface MedicalFile {
  _id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: string
  description?: string
  patient: {
    firstName: string
    lastName: string
  }
  uploadedBy: {
    firstName: string
    lastName: string
    role: string
  }
  createdAt: string
}

interface MedicalFilesResponse {
  files: MedicalFile[]
  total: number
}

interface UploadMedicalFileData {
  patientId: string
  category: string
  description: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
}

export const medicalFilesApi = {
  getFiles: async (params?: { category?: string }): Promise<MedicalFilesResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.category && params.category !== "all") {
      searchParams.append("category", params.category)
    }

    const response = await fetch(`/api/medical-files?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch medical files")
    return response.json()
  },

  uploadFile: async (data: UploadMedicalFileData): Promise<MedicalFile> => {
    const response = await fetch("/api/medical-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to upload medical file")
    return response.json()
  },

  deleteFile: async (fileId: string): Promise<void> => {
    const response = await fetch(`/api/medical-files/${fileId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete medical file")
  },
}

export type { MedicalFile, MedicalFilesResponse, UploadMedicalFileData }