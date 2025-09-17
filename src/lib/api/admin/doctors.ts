import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface DoctorFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  specialization?: string
}

export const doctorsApi = {
  getDoctors: async (filters: DoctorFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.specialization && filters.specialization !== 'all' && { specialization: filters.specialization }),
    })
    
    const { data } = await api.get(`/admin/doctors?${params}`)
    return data
  },

  getDoctorStats: async () => {
    const { data } = await api.get('/admin/doctors/stats')
    return data
  },

  getSpecializations: async () => {
    const { data } = await api.get('/specializations')
    return data
  },

  updateDoctor: async (id: string, updateData: any) => {
    const { data } = await api.patch(`/admin/doctors/${id}`, updateData)
    return data
  },

  deleteDoctor: async (id: string) => {
    const { data } = await api.delete(`/admin/doctors/${id}`)
    return data
  },

  bulkUpdateDoctors: async (ids: string[], updateData: any) => {
    await Promise.all(
      ids.map(id => api.patch(`/admin/doctors/${id}`, updateData))
    )
  },

  exportDoctors: async () => {
    const response = await api.get('/admin/doctors/export', {
      responseType: 'blob'
    })
    return response.data
  }
}