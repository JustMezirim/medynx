import { useQuery } from "@tanstack/react-query"
import { doctorPatientsApi } from "@/lib/api/doctor/doctor-patients"

export const useDoctorPatients = () => {
  return useQuery({
    queryKey: ["doctor-patients"],
    queryFn: () => doctorPatientsApi.getPatients(),
  })
}

export const usePatientDetails = (patientId: string) => {
  return useQuery({
    queryKey: ["patient-details", patientId],
    queryFn: () => doctorPatientsApi.getPatientDetails(patientId),
    enabled: !!patientId,
  })
}