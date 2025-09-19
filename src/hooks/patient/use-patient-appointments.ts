import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { patientAppointmentsApi, type CreateAppointmentData } from "@/lib/api/patient/appointments"
import { showToast } from "@/components/ui/toast-helper"

export const usePatientAppointments = () => {
  return useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () => patientAppointmentsApi.getAppointments(),
  })
}

export const usePatientAppointment = (id: string) => {
  return useQuery({
    queryKey: ["patient-appointment", id],
    queryFn: () => patientAppointmentsApi.getAppointment(id),
    enabled: !!id,
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateAppointmentData) => patientAppointmentsApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] })
      showToast.success("Appointment booked successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to book appointment")
    },
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => patientAppointmentsApi.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] })
      showToast.success("Appointment cancelled successfully")
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to cancel appointment")
    },
  })
}

export const useJoinMeeting = () => {
  return useMutation({
    mutationFn: (id: string) => patientAppointmentsApi.joinMeeting(id),
    onSuccess: (data) => {
      window.open(data.joinUrl, '_blank')
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to join meeting")
    },
  })
}