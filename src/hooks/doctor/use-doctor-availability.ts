import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorAvailabilityApi } from '@/lib/api/doctor/doctor-availability'

export const useDoctorAvailability = () => {
  return useQuery({
    queryKey: ['doctor-availability'],
    queryFn: doctorAvailabilityApi.getAvailability,
  })
}

export const useTimeSlots = (date: Date | undefined, startHour?: number, endHour?: number) => {
  return useQuery({
    queryKey: ['time-slots', date?.toISOString(), startHour, endHour],
    queryFn: () => date ? doctorAvailabilityApi.getTimeSlots(date, startHour, endHour) : null,
    enabled: !!date,
  })
}

export const useSaveAvailability = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: doctorAvailabilityApi.saveAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-availability'] })
      queryClient.invalidateQueries({ queryKey: ['time-slots'] })
    },
  })
}

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: doctorAvailabilityApi.deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-availability'] })
      queryClient.invalidateQueries({ queryKey: ['time-slots'] })
    },
  })
}