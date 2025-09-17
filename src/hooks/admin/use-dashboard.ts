import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/admin/dashboard'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60000, // Refetch every minute
  })
}

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: dashboardApi.getRecentActivity,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: dashboardApi.getSystemStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useChartData = (period: string = '7d') => {
  return useQuery({
    queryKey: ['chart-data', period],
    queryFn: () => dashboardApi.getChartData(period),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}