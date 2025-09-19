"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { LoadingSpinner } from "@/components/patient"
import { DashboardStats, RecentAppointments, QuickActions, Notifications, HealthTips } from "@/components/patient"
import { usePatientDashboardStats, usePatientRecentAppointments } from "@/hooks/patient/use-patient-dashboard"


export default function PatientDashboard() {
  const { data: stats, isLoading: statsLoading } = usePatientDashboardStats()
  const { data: recentAppointments = [], isLoading: appointmentsLoading } = usePatientRecentAppointments()

  const isLoading = statsLoading || appointmentsLoading

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">

        <DashboardHeader />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-10xl mx-auto space-y-8">
              <DashboardStats stats={stats || null} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentAppointments appointments={recentAppointments} />
                
                <div className="space-y-6">
                  <QuickActions />
                  <Notifications />
                </div>
              </div>

              <HealthTips />
            </div>
          </main>
        </div>
      </div>
  )
}
