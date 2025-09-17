"use client"

import type React from "react"
import { useEffect, useState, useCallback  } from "react"
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
import { Check, X, Activity, Clock, FileText } from "lucide-react"

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
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    todayAppointments: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid" | "table">("list")

  const fetchAppointments = useCallback(async () => {
    // Loading handled by React Query
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(searchQuery && { search: searchQuery }),
        ...(dateRange !== "all" && { dateRange }),
      })
      const response = await fetch(`/api/appointment?${params}`)
      const data = await response.json()
      setAppointments(data.appointments || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      showToast.error("Failed to load appointments")
    } finally {
      // Loading handled by React Query
    }
  }, [currentPage, statusFilter, typeFilter, searchQuery, dateRange])

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (dateRange !== "all") {
        params.append("dateRange", dateRange)
      }
      const response = await fetch(`/api/appointment/stats?${params}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAppointments()
    fetchStats()
  }, [statusFilter, typeFilter, searchQuery, dateRange, currentPage, fetchAppointments, fetchStats])

  const handleUpdateAppointment = async (appointmentId: string, updates: unknown) => {
    try {
      const response = await fetch(`/api/appointment/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        showToast.success("Appointment updated successfully")
        fetchAppointments()
        fetchStats()
        setShowDetailsModal(false)
      } else {
        const data = await response.json()
        showToast.error(data.message || "Failed to update appointment")
      }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <FileText className="h-3 w-3" />
      case "cancelled":
        return <X className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
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
    const csvContent = appointments.map(apt => 
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





  if (loading && appointments.length === 0) {
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
            <AppointmentStats stats={stats} />

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
                    getStatusColor={getStatusColor}
                    canJoinMeeting={canJoinMeeting}
                    onUpdateAppointment={handleUpdateAppointment}
                    onViewDetails={(appointment) => {
                      setSelectedAppointment(appointment)
                      setShowDetailsModal(true)
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                        canJoinMeeting={canJoinMeeting}
                        onUpdateAppointment={handleUpdateAppointment}
                        onViewDetails={(appointment) => {
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
