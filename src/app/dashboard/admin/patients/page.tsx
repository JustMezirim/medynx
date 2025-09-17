"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PatientStatsCards } from "@/components/admin/patients/patient-stats"
import { PatientFilters } from "@/components/admin/patients/patient-filters"
import { BulkActions } from "@/components/admin/shared/bulk-actions"
import { PatientsContent } from "@/components/admin/patients/patients-content"
import { PatientDetailsModal } from "@/components/admin/patients/patient-details-modal"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { LoadingSpinner } from "@/components/admin"
import { showToast } from '@/components/ui/toast-helper'
import { AddUserForm } from "@/components/admin/AddUserForm"
import { EditPatientForm } from "@/components/admin/EditPatientForm"
import { usePatients, usePatientStats, useUpdatePatient, useDeletePatient, useBulkUpdatePatients } from '@/hooks/admin/use-patients'
import { patientsApi } from '@/lib/api/admin/patients'
import { UserCheck, UserX } from "lucide-react"

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
  isActive: boolean
  createdAt: string
  appointmentCount: number
  lastAppointment?: string
  profileImage?: string
  emergencyContact?: string
  medicalHistory?: string[]
  totalSpent?: number
}

interface PatientStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  totalAppointments: number
}

export default function AdminPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: string
    patientId?: string
    value?: boolean
  } | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showEditPatientModal, setShowEditPatientModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const { data: patientsData, isLoading } = usePatients({
    page: currentPage,
    limit: 10,
    sortBy,
    sortOrder,
    search: searchTerm,
    status: statusFilter,
    gender: genderFilter,
  })

  const { data: stats } = usePatientStats()
  const updatePatient = useUpdatePatient()
  const deletePatient = useDeletePatient()
  const bulkUpdatePatients = useBulkUpdatePatients()

  const patients = (patientsData as any)?.patients || []
  const totalPages = (patientsData as any)?.pagination?.pages || 1

  const handleAction = (type: string, patientId?: string, value?: boolean) => {
    setConfirmAction({ type, patientId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, patientId, value } = confirmAction
      
      if (type === "bulk") {
        await bulkUpdatePatients.mutateAsync({ ids: selectedPatients, data: { isActive: value } })
        showToast.success(`Bulk action completed successfully`)
        setSelectedPatients([])
      } else if (type === "delete") {
        await deletePatient.mutateAsync(patientId!)
        showToast.success("Patient deleted successfully")
      } else {
        await updatePatient.mutateAsync({ id: patientId!, data: { isActive: value } })
        const actionText = value ? "activated" : "deactivated"
        showToast.success(`Patient ${actionText} successfully`)
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
    setSelectedPatients(checked ? patients.map((p: Patient) => p._id) : [])
  }

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    setSelectedPatients(prev => 
      checked ? [...prev, patientId] : prev.filter(id => id !== patientId)
    )
  }

  const exportPatients = async () => {
    try {
      const blob = await patientsApi.exportPatients()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `patients-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      showToast.success("Patients data exported successfully")
    } catch {
      showToast.error("Export failed")
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (isLoading && patients.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <PatientStatsCards stats={stats} />

          <PatientFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            genderFilter={genderFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onGenderChange={setGenderFilter}
            onSortChange={(field, order) => {
              setSortBy(field)
              setSortOrder(order)
            }}
            onExport={exportPatients}
            onAddPatient={() => setShowAddPatientModal(true)}
          />

          <BulkActions
            selectedCount={selectedPatients.length}
            entityName="patient"
            actions={[
              {
                label: "Activate Selected",
                icon: <UserCheck className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, true)
              },
              {
                label: "Deactivate Selected",
                icon: <UserX className="h-4 w-4 mr-2" />,
                onClick: () => handleAction("bulk", undefined, false)
              }
            ]}
            onClearSelection={() => setSelectedPatients([])}
          />

          <PatientsContent
            patients={patients}
            selectedPatients={selectedPatients}
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectAll={handleSelectAll}
            onSelectPatient={handleSelectPatient}
            onViewDetails={(patient) => {
              setSelectedPatient(patient)
              setShowPatientModal(true)
            }}
            onEditPatient={(patient) => {
              setEditingPatient(patient)
              setShowEditPatientModal(true)
            }}
            onAction={handleAction}
            onPageChange={setCurrentPage}
            onAddPatient={() => setShowAddPatientModal(true)}
            calculateAge={calculateAge}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            genderFilter={genderFilter}
          />
        </main>
      </div>

      <PatientDetailsModal
        open={showPatientModal}
        onOpenChange={setShowPatientModal}
        patient={selectedPatient}
        onEdit={(patient) => {
          setEditingPatient(patient)
          setShowPatientModal(false)
          setShowEditPatientModal(true)
        }}
        calculateAge={calculateAge}
      />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={executeAction}
      />

      <Dialog open={showAddPatientModal} onOpenChange={setShowAddPatientModal}>
        <DialogContent className='max-w-md border-0 shadow-xl'>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Create a new patient account in the system.
            </DialogDescription>
          </DialogHeader>
          <AddUserForm 
            userType="patient"
            onSuccess={() => setShowAddPatientModal(false)}
            onCancel={() => setShowAddPatientModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditPatientModal} onOpenChange={setShowEditPatientModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Profile</DialogTitle>
            <DialogDescription>
              Update patient information and medical details.
            </DialogDescription>
          </DialogHeader>
          {editingPatient && (
            <EditPatientForm 
              patient={editingPatient}
              onSuccess={() => {
                setShowEditPatientModal(false)
                setEditingPatient(null)
              }}
              onCancel={() => {
                setShowEditPatientModal(false)
                setEditingPatient(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}