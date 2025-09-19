"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { StatsCards } from "@/components/doctor/dashboard/stats-cards"
import { TodaysSchedule } from "@/components/doctor/dashboard/todays-schedule"
import { QuickActions } from "@/components/doctor/dashboard/quick-actions"
import { Notifications } from "@/components/doctor/dashboard/notifications"
import { LoadingSpinner } from "@/components/doctor"
import { useDoctorDashboard } from "@/hooks/doctor/use-doctor-dashboard"
import { getAppointmentStatusColor } from "@/components/ui/status-colors"


export default function DoctorDashboard() {
  const { data, isLoading } = useDoctorDashboard()
  const stats = data?.stats
  const todayAppointments = data?.todayAppointments || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="doctor" userName="Doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">

        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-8">
            <StatsCards stats={stats ?? null} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TodaysSchedule appointments={todayAppointments} getStatusColor={getAppointmentStatusColor} />
              
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
