import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get('/admin/dashboard/stats')
    return data
  },

  getRecentActivity: async () => {
    const { data } = await api.get('/admin/dashboard/recent-activity')
    return data
  },

  getSystemStatus: async () => {
    const { data } = await api.get('/admin/dashboard/system-status')
    return data
  },

  getChartData: async (period: string = '7d') => {
    const { data } = await api.get(`/admin/dashboard/charts?period=${period}`)
    return data
  }
}