import { useQuery } from "@tanstack/react-query"
import { notificationsApi } from "@/lib/api/patient/notifications"

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.getNotifications(),
  })
}