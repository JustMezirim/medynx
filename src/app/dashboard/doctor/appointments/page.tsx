"use client"

import type React from "react"
import { useState } from "react"
import { showToast } from "@/components/ui/toast-helper"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AppointmentStats } from "@/components/doctor/appointments/appointment-stats"
import { AppointmentFilters } from "@/components/doctor/appointments/appointment-filters"
import { AppointmentCard } from "@/components/doctor/appointments/appointment-card"
import { AppointmentTable } from "@/components/doctor/appointments/appointment-table"
import { AppointmentModal } from "@/components/doctor/appointments/appointment-modal"
import { EmptyState } from "@/components/doctor/appointments/empty-state"
import { Pagination } from "@/components/doctor/appointments/pagination"
import { useDoctorAppointments, useDoctorAppointmentStats, useUpdateDoctorAppointment } from '@/hooks/doctor/use-doctor-appointments'
import { getAppointmentStatusColor, getAppointmentStatusIconComponent } from "@/components/ui/status-colors"

interface Appointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar?: string
  }
  date: string
  timeSlot: string
  status: string
  type: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  amount: number
  zoomJoinUrl?: string
  zoomPassword?: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  todayAppointments: number
  revenue: number
}

export default function DoctorAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid" | "table">("list")

  const { data: appointmentsData, isLoading } = useDoctorAppointments({
    page: currentPage,
    limit: 12,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined
  })

  const { data: stats } = useDoctorAppointmentStats()
  const updateAppointment = useUpdateDoctorAppointment()

  const appointments = appointmentsData?.appointments || []
  const totalPages = appointmentsData?.pagination?.pages || 1



  const handleUpdateAppointment = async (appointmentId: string, updates: unknown) => {
    try {
      await updateAppointment.mutateAsync({ id: appointmentId, data: updates })
      showToast.success("Appointment updated successfully")
      setShowDetailsModal(false)
    } catch (error) {
      console.error("Error updating appointment:", error)
      showToast.error("Update failed")
    }
  }

  const handleCompleteConsultation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedAppointment) return

    const formData = new FormData(e.currentTarget)
    const updates = {
      status: "completed",
      diagnosis: formData.get("diagnosis"),
      prescription: formData.get("prescription"),
      notes: formData.get("notes"),
    }

    await handleUpdateAppointment(selectedAppointment._id, updates)
  }





  const canJoinMeeting = (appointment: Appointment): boolean => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`)
    const now = new Date()
    const timeDiff = appointmentDateTime.getTime() - now.getTime()
    const minutesDiff = timeDiff / (1000 * 60)
    return (
      appointment.status === "confirmed" &&
      appointment.type === "video" &&
      !!appointment.zoomJoinUrl &&
      minutesDiff <= 15 &&
      minutesDiff >= -60
    )
  }

  const exportAppointments = () => {
    const csvContent = appointments.map((apt: Appointment) => 
      `${apt.patient.firstName} ${apt.patient.lastName},${apt.patient.email},${apt.date},${apt.timeSlot},${apt.status},${apt.type},${apt.amount}`
    ).join('\n')
    
    const blob = new Blob([`Name,Email,Date,Time,Status,Type,Amount\n${csvContent}`], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'appointments.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }





  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="doctor" userName="Doctor" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader 
            // title="Appointments" 
            // subtitle="Manage your patient appointments" 
          />
          <main className="flex-1 overflow-y-auto p-6">
            {/* <LoadingSkeleton /> */}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="doctor" userName="Doctor" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title="Manage Appointments"
          // subtitle="View and manage your patient appointments and consultations"
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="max-w-10xl mx-auto space-y-8">
            <AppointmentStats stats={stats || { total: 0, scheduled: 0, completed: 0, cancelled: 0, todayAppointments: 0, totalRevenue: 0 }} />

            <AppointmentFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onExport={exportAppointments}
            />

            {appointments.length > 0 ? (
              <>
                {viewMode === "table" ? (
                  <AppointmentTable
                    appointments={appointments}
                    getStatusColor={getAppointmentStatusColor}
                    canJoinMeeting={canJoinMeeting}
                    onUpdateAppointment={handleUpdateAppointment}
                    onViewDetails={(appointment: Appointment) => {
                      setSelectedAppointment(appointment)
                      setShowDetailsModal(true)
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {appointments.map((appointment: Appointment) => (
                      <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                        getStatusColor={getAppointmentStatusColor}
                        getStatusIcon={getAppointmentStatusIconComponent}
                        canJoinMeeting={canJoinMeeting}
                        onUpdateAppointment={handleUpdateAppointment}
                        onViewDetails={(appointment: Appointment) => {
                          setSelectedAppointment(appointment)
                          setShowDetailsModal(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                onClearFilters={() => {
                  setStatusFilter("all")
                  setTypeFilter("all")
                  setSearchQuery("")
                  setDateRange("all")
                }}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onComplete={handleCompleteConsultation}
      />
    </div>
  )
}
