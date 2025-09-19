import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsApi } from '@/lib/api/admin/patients'

interface PatientFilters {
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: string
  gender?: string
}

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
  isActive: boolean
  createdAt: string
  emergencyContact?: string
  medicalHistory?: string[]
  appointmentCount?: number
  lastAppointment?: string
  totalSpent?: number
}

export const usePatients = (filters: PatientFilters) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientsApi.getPatients(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const usePatientStats = () => {
  return useQuery({
    queryKey: ['patient-stats'],
    queryFn: patientsApi.getPatientStats,
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) => 
      patientsApi.updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient-stats'] })
    },
  })
}

export const useDeletePatient = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: patientsApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient-stats'] })
    },
  })
}

export const useBulkUpdatePatients = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: Partial<Patient> }) => 
      patientsApi.bulkUpdatePatients(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient-stats'] })
    },
  })
}