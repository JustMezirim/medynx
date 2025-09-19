interface PatientDashboardStats {
  upcomingAppointments: number
  totalAppointments: number
  medicalFiles: number
  favoriteDoctor: string
}

interface RecentAppointment {
  _id: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  date: string
  timeSlot: string
  status: string
  type: string
}

export const patientDashboardApi = {
  getDashboardStats: async (): Promise<PatientDashboardStats> => {
    const response = await fetch('/api/patient/dashboard/stats')
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    const data = await response.json()
    return {
      upcomingAppointments: data.confirmedAppointments || 0,
      totalAppointments: data.totalAppointments || 0,
      medicalFiles: data.medicalFiles || 0,
      favoriteDoctor: data.favoriteDoctor || "Dr. Smith",
    }
  },

  getRecentAppointments: async (): Promise<RecentAppointment[]> => {
    const response = await fetch('/api/patient/appointments?limit=5')
    if (!response.ok) throw new Error('Failed to fetch recent appointments')
    const data = await response.json()
    return data.appointments || []
  }
}

export type { PatientDashboardStats, RecentAppointment }