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
import { DoctorStatsCards } from "@/components/admin/doctors/doctor-stats"
import { DoctorFilters } from "@/components/admin/doctors/doctor-filters"
import { DoctorsTable } from "@/components/admin/doctors/doctors-table"
import { LoadingSpinner } from "@/components/admin"
import { Stethoscope, Check, X, Mail, Phone, Star, MapPin, Plus } from 'lucide-react'
import { showToast } from '@/components/ui/toast-helper'
import { AddUserForm } from "@/components/admin/AddUserForm"
import { EditDoctorForm } from "@/components/admin/EditDoctorForm"

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

interface DoctorStats {
  total: number
  verified: number
  pending: number
  active: number
  inactive: number
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [stats, setStats] = useState<DoctorStats>({
    total: 0,
    verified: 0,
    pending: 0,
    active: 0,
    inactive: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  const [specializations, setSpecializations] = useState<string[]>([])

  useEffect(() => {
    fetchDoctors()
    fetchStats()
    fetchSpecializations()
  }, [searchTerm, statusFilter, specializationFilter, sortBy, sortOrder, currentPage])

  const fetchSpecializations = async () => {
    try {
      const response = await fetch('/api/specializations')
      if (response.ok) {
        const data = await response.json()
        setSpecializations(data.specializations?.map((s: any) => s.name) || [])
      }
    } catch (error) {
      console.error('Failed to fetch specializations:', error)
    }
  }

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(specializationFilter !== "all" && { specialization: specializationFilter }),
      })
      
      const response = await fetch(`/api/admin/doctors?${params}`)
      if (!response.ok) throw new Error("Failed to fetch doctors")
      
      const data = await response.json()
      setDoctors(data.doctors)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Error fetching doctors:", error)
      showToast.error("Failed to load doctors")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/doctors/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleAction = (type: string, doctorId?: string, value?: boolean) => {
    setConfirmAction({ type, doctorId, value })
    setShowConfirmDialog(true)
  }

  const executeAction = async () => {
    if (!confirmAction) return
    try {
      const { type, doctorId, value } = confirmAction
      
      if (type === "bulk") {
        const promises = selectedDoctors.map(id =>
          fetch(`/api/admin/doctors/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [value === true ? "isVerified" : "isActive"]: value }),
          })
        )
        await Promise.all(promises)
        showToast.success(`Bulk action completed successfully`)
        setSelectedDoctors([])
      } else {
        const response = await fetch(`/api/admin/doctors/${doctorId}`, {
          method: type === "delete" ? "DELETE" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: type !== "delete" ? JSON.stringify({
            ...(type === "verify" && { isVerified: value }),
            ...(type === "toggle" && { isActive: value }),
          }) : undefined,
        })
        if (response.ok) {
          const actionText = type === "delete" ? "deleted" :
                           type === "verify" ? (value ? "verified" : "unverified") :
                          (value ? "activated" : "deactivated")
          showToast.success(`Doctor ${actionText} successfully`)
        } else {
          showToast.error("Action failed")
        }
      }
      
      fetchDoctors()
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
    setSelectedDoctors(checked ? doctors.map(d => d._id) : [])
  }

  const handleSelectDoctor = (doctorId: string, checked: boolean) => {
    setSelectedDoctors(prev => 
      checked ? [...prev, doctorId] : prev.filter(id => id !== doctorId)
    )
  }

  const exportDoctors = async () => {
    try {
      const response = await fetch("/api/admin/doctors/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `doctors-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      showToast.success("Doctors data exported successfully")
    } catch (error) {
      showToast.error("Export failed")
    }
  }

  const getStatusColor = (isVerified: boolean, isActive: boolean) => {
    if (!isVerified) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
    if (!isActive) return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
  }

  const getStatusText = (isVerified: boolean, isActive: boolean) => {
    if (!isVerified) return "Pending"
    if (!isActive) return "Inactive"
    return "Verified"
  }

  if (loading && doctors.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Manage Doctors"
          subtitle="Oversee doctor registrations and verifications"
        />
        
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

          {/* Bulk Actions */}
          {selectedDoctors.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-700">
                      {selectedDoctors.length} doctor(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, true)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Verify Selected
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("bulk", undefined, false)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Deactivate Selected
                      </Button>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedDoctors([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {doctors.length > 0 ? (
            <DoctorsTable
              doctors={doctors}
              selectedDoctors={selectedDoctors}
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
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No doctors found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" || specializationFilter !== "all"
                    ? "No doctors match your search criteria. Try adjusting your filters."
                    : "No doctors have registered yet. Add the first doctor to get started."}
                </p>
                {(!searchTerm && statusFilter === "all" && specializationFilter === "all") && (
                  <Button onClick={() => setShowAddDoctorModal(true)} className="mt-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Doctor
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

      {/* Doctor Details Modal */}
      <Dialog open={showDoctorModal} onOpenChange={setShowDoctorModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Doctor Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
                    <AvatarImage src={selectedDoctor.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                      {selectedDoctor.firstName[0]}{selectedDoctor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 capitalize flex items-center gap-2 mt-1">
                      <Stethoscope className="h-4 w-4" />
                      {selectedDoctor.specialization}
                    </p>
                    <Badge className={`${getStatusColor(selectedDoctor.isVerified, selectedDoctor.isActive)} border font-medium mt-2`}>
                      {getStatusText(selectedDoctor.isVerified, selectedDoctor.isActive)}
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Experience</label>
                        <p className="text-lg font-semibold">{selectedDoctor.experience} years</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Rating</label>
                        <p className="text-lg font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          {selectedDoctor.rating.toFixed(1)}/5.0
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Consultation Fee</label>
                        <p className="text-lg font-semibold text-green-600">₦{selectedDoctor.consultationFee}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">License Number</label>
                        <p className="text-lg font-semibold">{selectedDoctor.licenseNumber}</p>
                      </div>
                    </div>
                    {selectedDoctor.bio && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">Bio</label>
                        <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">{selectedDoctor.bio}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{selectedDoctor.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">{selectedDoctor.phone}</span>
                      </div>
                      {selectedDoctor.address && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="font-medium">{selectedDoctor.address}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600">{selectedDoctor.totalPatients}</div>
                          <p className="text-sm text-blue-600/80 font-medium">Total Patients</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-emerald-600">{selectedDoctor.totalAppointments}</div>
                          <p className="text-sm text-emerald-600/80 font-medium">Total Appointments</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Joined Date</label>
                      <p className="text-lg font-semibold">{new Date(selectedDoctor.createdAt).toLocaleDateString('en-US', {
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

      {/* Add Doctor Modal */}
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
            onSuccess={() => {
              setShowAddDoctorModal(false)
              fetchDoctors()
              fetchStats()
            }}
            onCancel={() => setShowAddDoctorModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Modal */}
      <Dialog open={showEditDoctorModal} onOpenChange={setShowEditDoctorModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
            <DialogDescription>
              Update doctor information and settings.
            </DialogDescription>
          </DialogHeader>
          {editingDoctor && (
            <EditDoctorForm 
              doctor={editingDoctor}
              onSuccess={() => {
                setShowEditDoctorModal(false)
                setEditingDoctor(null)
                fetchDoctors()
                fetchStats()
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
