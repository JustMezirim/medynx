import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const settingsApi = {
  getSettings: async () => {
    const { data } = await api.get('/admin/settings')
    return data
  },

  updateSettings: async (settings: Record<string, unknown>) => {
    const { data } = await api.patch('/admin/settings', settings)
    return data
  },

  getSystemStatus: async () => {
    const { data } = await api.get('/admin/settings/system-status')
    return data
  },

  backupDatabase: async () => {
    const response = await api.post('/admin/settings/backup', {}, {
      responseType: 'blob'
    })
    return response.data
  },

  clearCache: async () => {
    const { data } = await api.post('/admin/settings/clear-cache')
    return data
  }
}