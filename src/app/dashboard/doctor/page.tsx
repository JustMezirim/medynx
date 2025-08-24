"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { StatsCards } from "@/components/doctor/dashboard/stats-cards"
import { TodaysSchedule } from "@/components/doctor/dashboard/todays-schedule"
import { QuickActions } from "@/components/doctor/dashboard/quick-actions"
import { Notifications } from "@/components/doctor/dashboard/notifications"
import { LoadingSpinner } from "@/components/doctor"

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

export default function DoctorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/dashboard/stats")
      const statsData = await statsRes.json()

      // Fetch appointments
      const appointmentsRes = await fetch("/api/appointment?limit=10")
      const appointmentsData = await appointmentsRes.json()

      const today = new Date().toISOString().split("T")[0]
      const todayAppts = appointmentsData.appointments?.filter((apt: any) => apt.date.split("T")[0] === today) || []

      // Calculate monthly earnings from completed appointments
      const completedAppts = appointmentsData.appointments?.filter((apt: any) => apt.status === "completed") || []
      const monthlyEarnings = completedAppts.reduce((sum: number, apt: any) => sum + (apt.amount || 0), 0)
      
      // Get unique patients count
      const uniquePatients = new Set(appointmentsData.appointments?.map((apt: any) => apt.patient?._id) || []).size

      setStats({
        todayAppointments: todayAppts.length,
        totalPatients: uniquePatients,
        monthlyEarnings,
        completedAppointments: statsData.completedAppointments || 0,
      })

      setTodayAppointments(todayAppts)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="doctor" userName="Doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Doctor Dashboard" 
          subtitle="Welcome back! Here's your practice overview and today's schedule." 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-8">
            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TodaysSchedule appointments={todayAppointments} getStatusColor={getStatusColor} />
              
              <div className="space-y-6">
                <QuickActions />
                <Notifications />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
