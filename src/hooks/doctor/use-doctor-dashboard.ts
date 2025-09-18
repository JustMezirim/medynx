import { useQuery } from "@tanstack/react-query"
import { doctorDashboardApi } from "@/lib/api/doctor/doctor-dashboard"

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: () => doctorDashboardApi.getDashboardData(),
  })
}