"use client"

import { useState, useCallback  } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AppointmentStats, AppointmentFilters, UpcomingAppointmentCard, PastAppointmentCard, EmptyState } from "@/components/patient"
import { showToast } from "@/components/ui/toast-helper"

interface Appointment {
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
  symptoms?: string
  diagnosis?: string
  prescription?: string
  amount: number
  zoomJoinUrl?: string
  zoomPassword?: string
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)

  const fetchAppointments = useCallback(async () => {
    // Loading handled by React Query
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/appointment?${params}`)
      const data = await response.json()

      setAppointments(data.appointments || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch {
      showToast.error("Failed to load appointments")
    } finally {
      // Loading handled by React Query
    }
  }, [currentPage, statusFilter, searchTerm])

  // Replaced with React Query

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      const response = await fetch(`/api/appointment/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        showToast.success("Appointment cancelled successfully")
        fetchAppointments()
      } else {
        const data = await response.json()
        showToast.error(data.message || "Failed to cancel appointment")
      }
    } catch {
      showToast.error("An error occurred while cancelling")
    }
  }

  const canJoinMeeting = (appointment: Appointment): boolean => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`)
    const now = new Date()
    const timeDiff = appointmentDateTime.getTime() - now.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    return Boolean(
      appointment.status === "confirmed" &&
      appointment.type === "video" &&
      appointment.zoomJoinUrl &&
      minutesDiff <= 15 &&
      minutesDiff >= -60
    ) // Can join 15 min before to 60 min after
  }

  const canCancelAppointment = (appointment: Appointment): boolean => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.timeSlot}`)
    const now = new Date()
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return Boolean(appointment.status === "confirmed" && hoursDiff > 24)
  }

  const submitReview = async () => {
    if (!selectedAppointment) return
    
    try {
      const response = await fetch(`/api/appointment/${selectedAppointment._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review: reviewText })
      })
      
      if (response.ok) {
        showToast.success("Review submitted successfully")
        setSelectedAppointment(null)
        setReviewText("")
        setRating(5)
        fetchAppointments()
      }
    } catch {
      showToast.error("Failed to submit review")
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = searchTerm === '' || 
      `${apt.doctor.firstName} ${apt.doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingAppointments = filteredAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date)
    appointmentDate.setHours(0, 0, 0, 0)
    return (apt.status === 'confirmed' || apt.status === 'pending') && appointmentDate >= today
  })
  
  const pastAppointments = filteredAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date)
    appointmentDate.setHours(0, 0, 0, 0)
    return apt.status === 'completed' || apt.status === 'cancelled' || appointmentDate < today
  })

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole="patient" userName="John Doe" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <AppointmentStats 
            upcomingCount={upcomingAppointments.length}
            completedCount={pastAppointments.length}
            totalCount={appointments.length}
          />
          
          <AppointmentFilters 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          {/* Appointments Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <UpcomingAppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    onJoinMeeting={(url) => window.open(url, "_blank")}
                    canJoinMeeting={canJoinMeeting(appointment)}
                    canCancel={canCancelAppointment(appointment)}
                  />
                ))
              ) : (
                <EmptyState type="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastAppointments.map((appointment) => (
                    <PastAppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      rating={rating}
                      reviewText={reviewText}
                      onRatingChange={setRating}
                      onReviewChange={setReviewText}
                      onSubmitReview={submitReview}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="past" />
              )}
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
