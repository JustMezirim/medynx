import axios from 'axios'

const api = axios.create({
  baseURL: '/api/doctor',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface AppointmentFilters {
  page: number
  limit: number
  status?: string
  search?: string
}

export const doctorAppointmentsApi = {
  getAppointments: async (filters: AppointmentFilters) => {
    const { data } = await api.get('/appointments', { params: filters })
    return data
  },

  getAppointmentStats: async () => {
    const { data } = await api.get('/appointments/stats')
    return data
  },

  updateAppointment: async (id: string, data: any) => {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  }
}