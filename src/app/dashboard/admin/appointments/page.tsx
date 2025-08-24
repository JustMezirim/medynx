"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AppointmentStatsCards } from "@/components/admin/appointments/appointment-stats"
import { AppointmentFilters } from "@/components/admin/appointments/appointment-filters"
import { AppointmentsTable } from "@/components/admin/appointments/appointments-table"
import { LoadingSpinner } from "@/components/admin"
import { Calendar, User, Stethoscope, Video, Mail, FileText, Plus, CheckCircle, XCircle } from 'lucide-react'
import { showToast } from '@/components/ui/toast-helper'

interface Appointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  doctor: {
    firstName: string
    lastName: string
    specialization: string
    consultationFee?: number
  }
  date: string
  timeSlot: string
  status: string
  type: string
  amount: number
  paymentStatus: string
  createdAt: string
  meetingLink?: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

interface AppointmentStats {
  total: number
  scheduled: number
  completed: number
  cancelled: number
  todayAppointments: number
  totalRevenue: number
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    todayAppointments: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: string
    appointmentId?: string
    value?: string
  } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
    fetchStats()
  }, [searchTerm, statusFilter, typeFilter, paymentFilter, sortBy, sortOrder, currentPage])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
        ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
      })
      
      const response = await fetch(`/api/admin/appointments?${params}`)
      if (!response.ok) throw new Error("Failed to fetch appointments")
      
      const data = await response.json()
      setAppointments(data.appointments)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      showToast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/appointments/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      case "no-show":
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
    }
  }

  const handleAction = (type: string, appointmentId?: string, value?: string) => {
    setConfirmAction({ type, appointmentId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, appointmentId, value } = confirmAction
      
      if (type === "bulk") {
        const promises = selectedAppointments.map(id =>
          fetch(`/api/admin/appointments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: value }),
          })
        )
        await Promise.all(promises)
        showToast.success(`Bulk action completed successfully`)
        setSelectedAppointments([])
      } else if (type === "zoom") {
        const response = await fetch("/api/zoom/create-meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId }),
        })
        if (response.ok) {
          showToast.success("Zoom meeting created successfully")
        } else {
          showToast.error("Failed to create meeting")
        }
      } else {
        const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
          method: type === "delete" ? "DELETE" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: type !== "delete" ? JSON.stringify({ status: value }) : undefined,
        })
        if (response.ok) {
          const actionText = type === "delete" ? "deleted" : `marked as ${value}`
          showToast.success(`Appointment ${actionText} successfully`)
        } else {
          showToast.error("Action failed")
        }
      }
      
      fetchAppointments()
      fetchStats()
    } catch (error) {
      console.error("Error executing action:", error)
      showToast.error("Action failed")
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedAppointments(checked ? appointments.map(a => a._id) : [])
  }

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    setSelectedAppointments(prev => 
      checked ? [...prev, appointmentId] : prev.filter(id => id !== appointmentId)
    )
  }

  const exportAppointments = async () => {
    try {
      const response = await fetch("/api/admin/appointments/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      showToast.success("Appointments data exported successfully")
    } catch (error) {
      showToast.error("Export failed")
    }
  }

  if (loading && appointments.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Manage Appointments"
          subtitle="Oversee all appointments and consultations"
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <AppointmentStatsCards stats={stats} />

          <AppointmentFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            paymentFilter={paymentFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
            onPaymentChange={setPaymentFilter}
            onSortChange={(field, order) => {
              setSortBy(field)
              setSortOrder(order)
            }}
            onExport={exportAppointments}
          />

          {/* Bulk Actions */}
          {selectedAppointments.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedAppointments.length} appointment(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, "completed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Completed
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, "cancelled")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Selected
                      </Button>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedAppointments([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {appointments.length > 0 ? (
            <AppointmentsTable
              appointments={appointments}
              selectedAppointments={selectedAppointments}
              onSelectAll={handleSelectAll}
              onSelectAppointment={handleSelectAppointment}
              onViewDetails={(appointment) => {
                setSelectedAppointment(appointment)
                setShowAppointmentModal(true)
              }}
              onAction={handleAction}
              getStatusColor={getStatusColor}
              getPaymentStatusColor={getPaymentStatusColor}
            />
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No appointments found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all" || paymentFilter !== "all"
                    ? "No appointments match your search criteria. Try adjusting your filters."
                    : "No appointments have been scheduled yet."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-200"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-slate-200"}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-200"
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={executeAction} className="bg-blue-600 hover:bg-blue-700">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Appointment Details Modal */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Appointment Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                      {selectedAppointment.patient.firstName[0]}{selectedAppointment.patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Stethoscope className="h-4 w-4" />
                      with Dr. {selectedAppointment.doctor.firstName} {selectedAppointment.doctor.lastName}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge className={`${getStatusColor(selectedAppointment.status)} border font-medium`}>
                        {selectedAppointment.status}
                      </Badge>
                      <Badge className={`${getPaymentStatusColor(selectedAppointment.paymentStatus)} border font-medium`}>
                        {selectedAppointment.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Date & Time</label>
                        <p className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.timeSlot}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Type</label>
                        <p className="text-lg font-semibold capitalize flex items-center gap-2">
                          {selectedAppointment.type === "video" ? (
                            <Video className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 text-green-600" />
                          )}
                          {selectedAppointment.type}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Specialization</label>
                        <p className="text-lg font-semibold capitalize">{selectedAppointment.doctor.specialization}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Patient Email</label>
                        <p className="text-lg font-semibold flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {selectedAppointment.patient.email}
                        </p>
                      </div>
                    </div>
                    {selectedAppointment.meetingLink && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Meeting Link</label>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-blue-600 break-all font-medium">{selectedAppointment.meetingLink}</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="medical" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4" />
                          Symptoms
                        </label>
                        <p className="text-slate-700 dark:text-slate-300">{selectedAppointment.symptoms || 'No symptoms recorded'}</p>
                      </div>
                      <div className='p-4 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                          <Stethoscope className="h-4 w-4" />
                          Diagnosis
                        </label>
                        <p className="text-slate-700 dark:text-slate-300">{selectedAppointment.diagnosis || 'No diagnosis recorded'}</p>
                      </div>
                      <div className='p-4 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                        <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-2">
                          <Plus className="h-4 w-4" />
                          Prescription
                        </label>
                        <p className="text-slate-700 dark:text-slate-300">{selectedAppointment.prescription || 'No prescription recorded'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value='payment' className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">₦{selectedAppointment.amount}</div>
                          <p className="text-sm text-green-600/80 font-medium">Consultation Fee</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardContent className="p-6 text-center">
                          <Badge className={`${getPaymentStatusColor(selectedAppointment.paymentStatus)} border font-medium text-lg px-3 py-1`}>
                            {selectedAppointment.paymentStatus}
                          </Badge>
                          <p className="text-sm text-blue-600/80 font-medium mt-2">Payment Status</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Booked Date</label>
                      <p className="text-lg font-semibold">{new Date(selectedAppointment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
