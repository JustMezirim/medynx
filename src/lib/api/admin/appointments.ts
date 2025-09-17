import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface AppointmentFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  type?: string
  paymentStatus?: string
}

export const appointmentsApi = {
  getAppointments: async (filters: AppointmentFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.type && filters.type !== 'all' && { type: filters.type }),
      ...(filters.paymentStatus && filters.paymentStatus !== 'all' && { paymentStatus: filters.paymentStatus }),
    })
    
    const { data } = await api.get(`/admin/appointments?${params}`)
    return data
  },

  getAppointmentStats: async () => {
    const { data } = await api.get('/admin/appointments/stats')
    return data
  },

  updateAppointment: async (id: string, updateData: any) => {
    const { data } = await api.patch(`/admin/appointments/${id}`, updateData)
    return data
  },

  deleteAppointment: async (id: string) => {
    const { data } = await api.delete(`/admin/appointments/${id}`)
    return data
  },

  bulkUpdateAppointments: async (ids: string[], status: string) => {
    await Promise.all(
      ids.map(id => api.patch(`/admin/appointments/${id}`, { status }))
    )
  },

  createZoomMeeting: async (appointmentId: string) => {
    const { data } = await api.post('/zoom/create-meeting', { appointmentId })
    return data
  },

  exportAppointments: async () => {
    const response = await api.get('/admin/appointments/export', {
      responseType: 'blob'
    })
    return response.data
  }
}