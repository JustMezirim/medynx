import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface PatientFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  gender?: string
}

export const patientsApi = {
  getPatients: async (filters: PatientFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.gender && filters.gender !== 'all' && { gender: filters.gender }),
    })
    
    const { data } = await api.get(`/admin/patients?${params}`)
    return data
  },

  getPatientStats: async () => {
    const { data } = await api.get('/admin/patients/stats')
    return data
  },

  updatePatient: async (id: string, updateData: any) => {
    const { data } = await api.patch(`/admin/patients/${id}`, updateData)
    return data
  },

  deletePatient: async (id: string) => {
    const { data } = await api.delete(`/admin/patients/${id}`)
    return data
  },

  bulkUpdatePatients: async (ids: string[], updateData: any) => {
    await Promise.all(
      ids.map(id => api.patch(`/admin/patients/${id}`, updateData))
    )
  },

  exportPatients: async () => {
    const response = await api.get('/admin/patients/export', {
      responseType: 'blob'
    })
    return response.data
  }
}