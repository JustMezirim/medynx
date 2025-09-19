interface MedicalFile {
  _id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: "report" | "prescription" | "image" | "document"
  description: string
  uploadedBy: {
    firstName: string
    lastName: string
    role: string
  }
  createdAt: string
}

interface MedicalFileFilters {
  category?: string
  search?: string
}

export const patientMedicalFilesApi = {
  getMedicalFiles: async (filters?: MedicalFileFilters): Promise<MedicalFile[]> => {
    const params = new URLSearchParams()
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters?.search) params.append('search', filters.search)

    const response = await fetch(`/api/patient/medical-files?${params}`)
    if (!response.ok) throw new Error('Failed to fetch medical files')
    const data = await response.json()
    return data.files || []
  },

  downloadFile: async (fileId: string): Promise<void> => {
    const response = await fetch(`/api/patient/medical-files/${fileId}/download`)
    if (!response.ok) throw new Error('Failed to download file')
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'file'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export type { MedicalFile, MedicalFileFilters }