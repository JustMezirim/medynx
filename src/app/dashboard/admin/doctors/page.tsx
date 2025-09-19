"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DoctorStatsCards } from "@/components/admin/doctors/doctor-stats"
import { DoctorFilters } from "@/components/admin/doctors/doctor-filters"
import { BulkActions } from "@/components/admin/shared/bulk-actions"
import { DoctorsContent } from "@/components/admin/doctors/doctors-content"
import { DoctorDetailsModal } from "@/components/admin/doctors/doctor-details-modal"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { LoadingSpinner } from "@/components/admin"
import { showToast } from '@/components/ui/toast-helper'
import { getDoctorStatusColor, getDoctorStatusText } from '@/components/ui/status-colors'
import { AddUserForm } from "@/components/admin/AddUserForm"
import { EditDoctorForm } from "@/components/admin/EditDoctorForm"
import { useDoctors, useDoctorStats, useSpecializations, useUpdateDoctor, useDeleteDoctor, useBulkUpdateDoctors } from '@/hooks/admin/use-doctors'
import { doctorsApi } from '@/lib/api/admin/doctors'
import { Check, X } from "lucide-react"

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  rating: number
  consultationFee: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  totalPatients: number
  totalAppointments: number
  profileImage?: string
  address?: string
  bio?: string
  availability?: string[]
}



export default function AdminDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: string
    doctorId?: string
    value?: boolean
  } | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  const { data: doctorsData, isLoading } = useDoctors({
    page: currentPage,
    limit: 10,
    sortBy,
    sortOrder,
    search: searchTerm,
    status: statusFilter,
    specialization: specializationFilter,
  })

  const { data: stats } = useDoctorStats()
  const { data: specializationsData } = useSpecializations()
  const updateDoctor = useUpdateDoctor()
  const deleteDoctor = useDeleteDoctor()
  const bulkUpdateDoctors = useBulkUpdateDoctors()

  const doctors = doctorsData?.doctors || []
  const totalPages = doctorsData?.pagination?.pages || 1
  const specializations = specializationsData?.specializations?.map((s: { name: string }) => s.name) || []

  const handleAction = (type: string, doctorId?: string, value?: boolean) => {
    setConfirmAction({ type, doctorId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, doctorId, value } = confirmAction
      
      if (type === "bulk") {
        const updateData = { [value === true ? "isVerified" : "isActive"]: value }
        await bulkUpdateDoctors.mutateAsync({ ids: selectedDoctors, data: updateData })
        showToast.success(`Bulk action completed successfully`)
        setSelectedDoctors([])
      } else if (type === "delete") {
        await deleteDoctor.mutateAsync(doctorId!)
        showToast.success("Doctor deleted successfully")
      } else {
        const updateData = {
          ...(type === "verify" && { isVerified: value }),
          ...(type === "toggle" && { isActive: value }),
        }
        await updateDoctor.mutateAsync({ id: doctorId!, data: updateData })
        const actionText = type === "verify" ? (value ? "verified" : "unverified") :
                          (value ? "activated" : "deactivated")
        showToast.success(`Doctor ${actionText} successfully`)
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
    setSelectedDoctors(checked ? doctors.map((d: Doctor) => d._id) : [])
  }

  const handleSelectDoctor = (doctorId: string, checked: boolean) => {
    setSelectedDoctors(prev => 
      checked ? [...prev, doctorId] : prev.filter(id => id !== doctorId)
    )
  }

  const exportDoctors = async () => {
    try {
      const blob = await doctorsApi.exportDoctors()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `doctors-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      showToast.success("Doctors data exported successfully")
    } catch {
      showToast.error("Export failed")
    }
  }



  if (isLoading && doctors.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <DoctorStatsCards stats={stats} />

          <DoctorFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            specializationFilter={specializationFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            specializations={specializations}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onSpecializationChange={setSpecializationFilter}
            onSortChange={(field, order) => {
              setSortBy(field)
              setSortOrder(order)
            }}
            onExport={exportDoctors}
            onAddDoctor={() => setShowAddDoctorModal(true)}
          />

          <BulkActions
            selectedCount={selectedDoctors.length}
            entityName="doctor"
            actions={[
              {
                label: "Verify Selected",
                icon: <Check className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, true)
              },
              {
                label: "Deactivate Selected",
                icon: <X className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, false)
              }
            ]}
            onClearSelection={() => setSelectedDoctors([])}
          />

          <DoctorsContent
            doctors={doctors}
            selectedDoctors={selectedDoctors}
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectAll={handleSelectAll}
            onSelectDoctor={handleSelectDoctor}
            onViewDetails={(doctor) => {
              setSelectedDoctor(doctor)
              setShowDoctorModal(true)
            }}
            onEditDoctor={(doctor) => {
              setEditingDoctor(doctor)
              setShowEditDoctorModal(true)
            }}
            onAction={handleAction}
            onPageChange={setCurrentPage}
            onAddDoctor={() => setShowAddDoctorModal(true)}
            getStatusColor={getDoctorStatusColor}
            getStatusText={getDoctorStatusText}
          />
        </main>
      </div>

      <DoctorDetailsModal
        open={showDoctorModal}
        onOpenChange={setShowDoctorModal}
        doctor={selectedDoctor}
        onAction={handleAction}
        onEdit={(doctor) => {
          setEditingDoctor(doctor)
          setShowDoctorModal(false)
          setShowEditDoctorModal(true)
        }}
        getStatusColor={getDoctorStatusColor}
        getStatusText={getDoctorStatusText}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={executeAction}
      />

      <Dialog open={showAddDoctorModal} onOpenChange={setShowAddDoctorModal}>
        <DialogContent className='max-w-md border-0 shadow-xl'>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Create a new doctor account in the system.
            </DialogDescription>
          </DialogHeader>
          <AddUserForm 
            userType="doctor"
            onSuccess={() => setShowAddDoctorModal(false)}
            onCancel={() => setShowAddDoctorModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDoctorModal} onOpenChange={setShowEditDoctorModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
            <DialogDescription>
              Update doctor information and professional details.
            </DialogDescription>
          </DialogHeader>
          {editingDoctor && (
            <EditDoctorForm 
              doctor={editingDoctor}
              onSuccess={() => {
                setShowEditDoctorModal(false)
                setEditingDoctor(null)
              }}
              onCancel={() => {
                setShowEditDoctorModal(false)
                setEditingDoctor(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}