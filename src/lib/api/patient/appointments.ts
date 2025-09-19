interface Appointment {
  _id: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  date: string
  timeSlot: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  type?: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  amount: number
  paymentStatus: "pending" | "paid" | "refunded"
  zoomMeetingId?: string
  zoomJoinUrl?: string
  createdAt: string
}

interface CreateAppointmentData {
  doctorId: string
  date: string
  timeSlot: string
  symptoms: string
}

export const patientAppointmentsApi = {
  getAppointments: async (): Promise<Appointment[]> => {
    const response = await fetch('/api/patient/appointments')
    if (!response.ok) throw new Error('Failed to fetch appointments')
    const data = await response.json()
    return data.appointments || []
  },

  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await fetch(`/api/patient/appointments/${id}`)
    if (!response.ok) throw new Error('Failed to fetch appointment')
    const data = await response.json()
    return data.appointment
  },

  createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    const response = await fetch('/api/patient/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    })
    if (!response.ok) throw new Error('Failed to create appointment')
    const data = await response.json()
    return data.appointment
  },

  cancelAppointment: async (id: string): Promise<void> => {
    const response = await fetch(`/api/patient/appointments/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to cancel appointment')
  },

  joinMeeting: async (id: string): Promise<{ joinUrl: string }> => {
    const response = await fetch(`/api/patient/appointments/${id}/join`)
    if (!response.ok) throw new Error('Failed to get meeting link')
    return response.json()
  }
}

export type { Appointment, CreateAppointmentData }