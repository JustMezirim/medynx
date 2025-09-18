import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorAppointmentsApi } from '@/lib/api/doctor/doctor-appointments'

interface AppointmentFilters {
  page: number
  limit: number
  status?: string
  search?: string
}

export const useDoctorAppointments = (filters: AppointmentFilters) => {
  return useQuery({
    queryKey: ['doctor-appointments', filters],
    queryFn: () => doctorAppointmentsApi.getAppointments(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useDoctorAppointmentStats = () => {
  return useQuery({
    queryKey: ['doctor-appointment-stats'],
    queryFn: doctorAppointmentsApi.getAppointmentStats,
  })
}

export const useUpdateDoctorAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      doctorAppointmentsApi.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
      queryClient.invalidateQueries({ queryKey: ['doctor-appointment-stats'] })
    },
  })
}