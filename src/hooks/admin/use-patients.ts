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
    mutationFn: ({ id, data }: { id: string; data: any }) => 
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
    mutationFn: ({ ids, data }: { ids: string[]; data: any }) => 
      patientsApi.bulkUpdatePatients(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient-stats'] })
    },
  })
}