import { useQuery } from "@tanstack/react-query"
import { patientDashboardApi } from "@/lib/api/patient/dashboard"

export const usePatientDashboardStats = () => {
  return useQuery({
    queryKey: ["patient-dashboard-stats"],
    queryFn: () => patientDashboardApi.getDashboardStats(),
  })
}

export const usePatientRecentAppointments = () => {
  return useQuery({
    queryKey: ["patient-recent-appointments"],
    queryFn: () => patientDashboardApi.getRecentAppointments(),
  })
}