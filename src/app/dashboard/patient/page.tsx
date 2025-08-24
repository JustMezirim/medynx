"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { LoadingSpinner } from "@/components/patient"
import { DashboardStats, RecentAppointments, QuickActions, Notifications, HealthTips } from "@/components/patient"

interface DashboardStats {
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

export default function PatientDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/dashboard/stats")
      const statsData = await statsRes.json()

      // Fetch recent appointments
      const appointmentsRes = await fetch("/api/appointment?limit=5")
      const appointmentsData = await appointmentsRes.json()

      setStats({
        upcomingAppointments: statsData.confirmedAppointments || 0,
        totalAppointments: statsData.totalAppointments || 0,
        medicalFiles: 0,
        favoriteDoctor: "Dr. Smith",
      })

      setRecentAppointments(appointmentsData.appointments || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      // <div className="flex h-screen">
      //   <Sidebar userRole="patient" userName="Loading..." />
      //   <div className="flex-1 flex items-center justify-center">
      //     <div className="text-center">
      //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      //       <p className="mt-4 text-gray-600">Loading dashboard...</p>
      //     </div>
      //   </div>
      // </div>
      <LoadingSpinner />
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Dashboard" subtitle="Welcome back! Here's your health overview." />

        <main className="flex-1 overflow-y-auto p-6">
          <DashboardStats stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentAppointments appointments={recentAppointments} />
            
            <div className="space-y-6">
              <QuickActions />
              <Notifications />
            </div>
          </div>

          <HealthTips />
        </main>
      </div>
    </div>
  )
}
