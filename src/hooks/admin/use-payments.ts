import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '@/lib/api/admin/payments'

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

export const usePayments = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentsApi.getPayments(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: paymentsApi.getPaymentStats,
  })
}

export const useProcessRefund = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      paymentsApi.processRefund(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] })
    },
  })
}