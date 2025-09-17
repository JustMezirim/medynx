import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface PaymentFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  method?: string
  dateRange?: string
}

export const paymentsApi = {
  getPayments: async (filters: PaymentFilters) => {
    const params = new URLSearchParams({
      page: filters.page.toString(),
      limit: filters.limit.toString(),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.method && filters.method !== 'all' && { method: filters.method }),
      ...(filters.dateRange && filters.dateRange !== 'all' && { dateRange: filters.dateRange }),
    })
    
    const { data } = await api.get(`/admin/payments?${params}`)
    return data
  },

  getPaymentStats: async () => {
    const { data } = await api.get('/admin/payments/stats')
    return data
  },

  processRefund: async (id: string, refundData: any) => {
    const { data } = await api.post(`/admin/payments/${id}/refund`, refundData)
    return data
  },

  exportPayments: async () => {
    const response = await api.get('/admin/payments/export', {
      responseType: 'blob'
    })
    return response.data
  }
}