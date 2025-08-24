"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import DoctorAvailabilityCalendar from "@/components/doctor/availability/availability-calendar"

export default function DoctorAvailabilityPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="doctor" userName="Dr. Smith" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Manage Availability" 
          subtitle="Set your available time slots for appointments"
        />
        
        <main className="flex-1 overflow-y-auto">
          <DoctorAvailabilityCalendar />
        </main>
      </div>
    </div>
  )
}
