"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PatientStatsCards } from "@/components/admin/patients/patient-stats"
import { PatientFilters } from "@/components/admin/patients/patient-filters"
import { PatientsTable } from "@/components/admin/patients/patients-table"
import { LoadingSpinner } from "@/components/admin"
import { User, Mail, Phone, MapPin, Heart, Plus, UserCheck, UserX } from 'lucide-react'
import { showToast } from '@/components/ui/toast-helper'
import { AddUserForm } from "@/components/admin/AddUserForm"
import { EditPatientForm } from "@/components/admin/EditPatientForm"

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
  const [patients, setPatients] = useState<Patient[]>([])
  const [stats, setStats] = useState<PatientStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    totalAppointments: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  useEffect(() => {
    fetchPatients()
    fetchStats()
  }, [searchTerm, statusFilter, genderFilter, sortBy, sortOrder, currentPage])

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(genderFilter !== "all" && { gender: genderFilter }),
      })
      
      const response = await fetch(`/api/admin/patients?${params}`)
      if (!response.ok) throw new Error("Failed to fetch patients")
      
      const data = await response.json()
      setPatients(data.patients)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching patients:", error)
      showToast.error("Failed to load patients")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/patients/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleAction = (type: string, patientId?: string, value?: boolean) => {
    setConfirmAction({ type, patientId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, patientId, value } = confirmAction
      
      if (type === "bulk") {
        const promises = selectedPatients.map(id =>
          fetch(`/api/admin/patients/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: value }),
          })
        )
        await Promise.all(promises)
        showToast.success(`Bulk action completed successfully`)
        setSelectedPatients([])
      } else {
        const response = await fetch(`/api/admin/patients/${patientId}`, {
          method: type === "delete" ? "DELETE" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: type !== "delete" ? JSON.stringify({ isActive: value }) : undefined,
        })
        if (response.ok) {
          const actionText = type === "delete" ? "deleted" : (value ? "activated" : "deactivated")
          showToast.success(`Patient ${actionText} successfully`)
        } else {
          showToast.error("Action failed")
        }
      }
      
      fetchPatients()
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
    setSelectedPatients(checked ? patients.map(p => p._id) : [])
  }

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    setSelectedPatients(prev => 
      checked ? [...prev, patientId] : prev.filter(id => id !== patientId)
    )
  }

  const exportPatients = async () => {
    try {
      const response = await fetch("/api/admin/patients/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `patients-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      showToast.success("Patients data exported successfully")
    } catch (error) {
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

  if (loading && patients.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Manage Patients"
          subtitle="Oversee patient registrations and health records"
        />
        
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

          {/* Bulk Actions */}
          {selectedPatients.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedPatients.length} patient(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, true)}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate Selected
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, false)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate Selected
                      </Button>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedPatients([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {patients.length > 0 ? (
            <PatientsTable
              patients={patients}
              selectedPatients={selectedPatients}
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
              calculateAge={calculateAge}
            />
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No patients found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" || genderFilter !== "all"
                    ? "No patients match your search criteria. Try adjusting your filters."
                    : "No patients have registered yet. Add the first patient to get started."}
                </p>
                {(!searchTerm && statusFilter === "all" && genderFilter === "all") && (
                  <Button onClick={() => setShowAddPatientModal(true)} className="mt-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Patient
                  </Button>
                )}
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

      {/* Patient Details Modal */}
      <Dialog open={showPatientModal} onOpenChange={setShowPatientModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Patient Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
                    <AvatarImage src={selectedPatient.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-lg font-semibold">
                      {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      {selectedPatient.gender} • {calculateAge(selectedPatient.dateOfBirth)} years old
                    </p>
                    <Badge className={`${selectedPatient.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} border font-medium mt-2`}>
                      {selectedPatient.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="medical">Medical</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                        <p className="text-lg font-semibold">{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Gender</label>
                        <p className="text-lg font-semibold capitalize">{selectedPatient.gender}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Total Appointments</label>
                        <p className="text-lg font-semibold text-purple-600">{selectedPatient.appointmentCount}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Total Spent</label>
                        <p className="text-lg font-semibold text-green-600">₦{selectedPatient.totalSpent || 0}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Last Appointment</label>
                      <p className="text-lg font-semibold">{selectedPatient.lastAppointment ? new Date(selectedPatient.lastAppointment).toLocaleDateString() : 'No appointments yet'}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value='contact' className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{selectedPatient.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">{selectedPatient.phone}</span>
                      </div>
                      {selectedPatient.address && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">{selectedPatient.address}</span>
                        </div>
                      )}
                      {selectedPatient.emergencyContact && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <Phone className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <span className="text-sm text-slate-500 block">Emergency Contact</span>
                            <span className="font-medium">{selectedPatient.emergencyContact}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="medical" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-500">Medical History</label>
                        {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                          <div className="mt-3 space-y-2">
                            {selectedPatient.medicalHistory.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                                  <Heart className="h-3 w-3 text-red-600" />
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">No medical history recorded</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Registration Date</label>
                        <p className="text-lg font-semibold">{new Date(selectedPatient.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Patient Modal */}
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
            onSuccess={() => {
              setShowAddPatientModal(false)
              fetchPatients()
              fetchStats()
            }}
            onCancel={() => setShowAddPatientModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Patient Modal */}
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
                fetchPatients()
                fetchStats()
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
