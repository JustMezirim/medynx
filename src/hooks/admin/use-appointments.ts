import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '@/lib/api/admin/appointments'

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

interface Appointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  doctor: {
    firstName: string
    lastName: string
    specialization: string
    consultationFee?: number
  }
  date: string
  timeSlot: string
  status: string
  type: string
  amount: number
  paymentStatus: string
  createdAt: string
  meetingLink?: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

interface AppointmentStats {
  total: number
  scheduled: number
  completed: number
  cancelled: number
  todayAppointments: number
  totalRevenue: number
}

export const useAppointments = (filters: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentsApi.getAppointments(filters),
  })
}

export const useAppointmentStats = () => {
  return useQuery({
    queryKey: ['appointment-stats'],
    queryFn: appointmentsApi.getAppointmentStats,
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      appointmentsApi.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] })
    },
  })
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appointmentsApi.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] })
    },
  })
}

export const useBulkUpdateAppointments = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => 
      appointmentsApi.bulkUpdateAppointments(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] })
    },
  })
}

export const useCreateZoomMeeting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appointmentsApi.createZoomMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}