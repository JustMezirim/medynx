import { useQuery } from "@tanstack/react-query"
import { patientDoctorsApi, type DoctorFilters } from "@/lib/api/patient/doctors"

export const usePatientDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: ["patient-doctors", filters],
    queryFn: () => patientDoctorsApi.getDoctors(filters),
  })
}

export const usePatientDoctor = (id: string) => {
  return useQuery({
    queryKey: ["patient-doctor", id],
    queryFn: () => patientDoctorsApi.getDoctor(id),
    enabled: !!id,
  })
}

export const useDoctorAvailability = (id: string, date: string) => {
  return useQuery({
    queryKey: ["doctor-availability", id, date],
    queryFn: () => patientDoctorsApi.getDoctorAvailability(id, date),
    enabled: !!id && !!date,
  })
}