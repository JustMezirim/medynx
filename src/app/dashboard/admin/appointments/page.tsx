"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AppointmentStatsCards } from "@/components/admin/appointments/appointment-stats"
import { AppointmentFilters } from "@/components/admin/appointments/appointment-filters"
import { BulkActions } from "@/components/admin/shared/bulk-actions"
import { AppointmentsContent } from "@/components/admin/appointments/appointments-content"
import { AppointmentDetailsModal } from "@/components/admin/appointments/appointment-details-modal"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { LoadingSpinner } from "@/components/admin"
import { showToast } from '@/components/ui/toast-helper'
import { 
  useAppointments, 
  useAppointmentStats, 
  useUpdateAppointment, 
  useDeleteAppointment, 
  useBulkUpdateAppointments, 
  useCreateZoomMeeting } from '@/hooks/admin/use-appointments'
import { appointmentsApi } from '@/lib/api/admin/appointments'
import { CheckCircle, XCircle } from "lucide-react"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: string
    appointmentId?: string
    value?: string
  } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const { data: appointmentsData, isLoading } = useAppointments({
    page: currentPage,
    limit: 10,
    sortBy,
    sortOrder,
    search: searchTerm,
    status: statusFilter,
    type: typeFilter,
    paymentStatus: paymentFilter,
  })

  const { data: stats } = useAppointmentStats()
  const updateAppointment = useUpdateAppointment()
  const deleteAppointment = useDeleteAppointment()
  const bulkUpdateAppointments = useBulkUpdateAppointments()
  const createZoomMeeting = useCreateZoomMeeting()

  const appointments = appointmentsData?.appointments || []
  const totalPages = appointmentsData?.pagination?.pages || 1

  const handleAction = (type: string, appointmentId?: string, value?: string) => {
    setConfirmAction({ type, appointmentId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, appointmentId, value } = confirmAction
      
      if (type === "bulk") {
        await bulkUpdateAppointments.mutateAsync({ ids: selectedAppointments, status: value! })
        showToast.success(`Bulk action completed successfully`)
        setSelectedAppointments([])
      } else if (type === "zoom") {
        await createZoomMeeting.mutateAsync(appointmentId!)
        showToast.success("Zoom meeting created successfully")
      } else if (type === "delete") {
        await deleteAppointment.mutateAsync(appointmentId!)
        showToast.success("Appointment deleted successfully")
      } else {
        await updateAppointment.mutateAsync({ id: appointmentId!, data: { status: value } })
        showToast.success(`Appointment marked as ${value} successfully`)
      }
    } catch (error) {
      console.error("Error executing action:", error)
      showToast.error("Action failed")
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedAppointments(checked ? appointments.map((a: Appointment) => a._id) : [])
  }

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    setSelectedAppointments(prev => 
      checked ? [...prev, appointmentId] : prev.filter(id => id !== appointmentId)
    )
  }

  const exportAppointments = async () => {
    try {
      const blob = await appointmentsApi.exportAppointments()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      showToast.success("Appointments data exported successfully")
    } catch {
      showToast.error("Export failed")
    }
  }

  if (isLoading && appointments.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title="Manage Appointments"
          // subtitle="Oversee all appointments and consultations"
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

          <BulkActions
            selectedCount={selectedAppointments.length}
            entityName="appointment"
            actions={[
              {
                label: "Mark Completed",
                icon: <CheckCircle className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, "completed")
              },
              {
                label: "Cancel Selected",
                icon: <XCircle className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, "cancelled")
              }
            ]}
            onClearSelection={() => setSelectedAppointments([])}
          />

          <AppointmentsContent
            appointments={appointments}
            selectedAppointments={selectedAppointments}
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectAll={handleSelectAll}
            onSelectAppointment={handleSelectAppointment}
            onViewDetails={(appointment) => {
              setSelectedAppointment(appointment)
              setShowAppointmentModal(true)
            }}
            onAction={handleAction}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <AppointmentDetailsModal
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        appointment={selectedAppointment}
        onAction={handleAction}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={executeAction}
      />
    </div>
  )
} 