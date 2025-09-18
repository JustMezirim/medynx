interface DashboardStats {
  todayAppointments: number
  totalPatients: number
  monthlyEarnings: number
  completedAppointments: number
}

interface TodayAppointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
  }
  timeSlot: string
  status: string
  type: string
  symptoms?: string
}

interface DashboardData {
  stats: DashboardStats
  todayAppointments: TodayAppointment[]
}

export const doctorDashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const [statsRes, appointmentsRes] = await Promise.all([
      fetch("/api/dashboard/stats"),
      fetch("/api/appointments?limit=10")
    ])

    if (!statsRes.ok) throw new Error("Failed to fetch stats")
    if (!appointmentsRes.ok) throw new Error("Failed to fetch appointments")

    const statsData = await statsRes.json()
    const appointmentsData = await appointmentsRes.json()

    const today = new Date().toISOString().split("T")[0]
    const todayAppts = appointmentsData.appointments?.filter((apt: { date: string }) => apt.date.split("T")[0] === today) || []

    const completedAppts = appointmentsData.appointments?.filter((apt: { status: string }) => apt.status === "completed") || []
    const monthlyEarnings = completedAppts.reduce((sum: number, apt: { amount?: number }) => sum + (apt.amount || 0), 0)
    
    const uniquePatients = new Set(appointmentsData.appointments?.map((apt: { patient?: { _id: string } }) => apt.patient?._id) || []).size

    return {
      stats: {
        todayAppointments: todayAppts.length,
        totalPatients: uniquePatients,
        monthlyEarnings,
        completedAppointments: statsData.completedAppointments || 0,
      },
      todayAppointments: todayAppts,
    }
  },
}

export type { DashboardStats, TodayAppointment, DashboardData }