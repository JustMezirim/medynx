import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorsApi } from '@/lib/api/admin/doctors'

interface DoctorFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  specialization?: string
}

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  consultationFee: number
  bio?: string
  isActive: boolean
  isVerified: boolean
  rating?: number
  createdAt: string
}

export const useDoctors = (filters: DoctorFilters) => {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsApi.getDoctors(filters),
  })
}

export const useDoctorStats = () => {
  return useQuery({
    queryKey: ['doctor-stats'],
    queryFn: doctorsApi.getDoctorStats,
  })
}

export const useSpecializations = () => {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: doctorsApi.getSpecializations,
  })
}

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Doctor> }) => 
      doctorsApi.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      queryClient.invalidateQueries({ queryKey: ['doctor-stats'] })
      queryClient.refetchQueries({ queryKey: ['doctors'] })
    },
  })
}

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: doctorsApi.deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      queryClient.invalidateQueries({ queryKey: ['doctor-stats'] })
    },
  })
}

export const useBulkUpdateDoctors = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<Doctor> }) => 
      doctorsApi.bulkUpdateDoctors(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      queryClient.invalidateQueries({ queryKey: ['doctor-stats'] })
    },
  })
}