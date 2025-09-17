"use client"

import { useState  } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PatientsHeader } from "@/components/doctor/patients/patients-header"
import { PatientsSearch } from "@/components/doctor/patients/patients-search"
import { PatientCard } from "@/components/doctor/patients/patient-card"
import { PatientsEmptyState } from "@/components/doctor/patients/patients-empty-state"
import { LoadingSpinner } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Download, UserPlus } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"
import Link from "next/link"

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  lastAppointment: string
  appointmentsCount: number
  lastStatus: string
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Replaced with React Query

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/doctor/patients")
      const data = await response.json()

      if (response.ok) {
        setPatients(data.patients)
      } else {
        showToast.error(data.message || "Failed to load patients")
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      showToast.error("Failed to load patients")
    } finally {
      // Loading handled by React Query
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewPatient = (patientId: string) => {
    // Navigate to patient details
    window.location.href = `/dashboard/doctor/patients/${patientId}`
  }

  const handleViewMedicalFiles = (patientId: string) => {
    // Navigate to medical files
    window.location.href = `/dashboard/doctor/patients/${patientId}/files`
  }

  const handleExportPatients = () => {
    showToast.info("Export functionality coming soon")
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="doctor" userName="Doctor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title="My Patients" 
          // subtitle="Manage your patient records and medical history"
          actions={
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPatients}
                className="border-slate-200 dark:border-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/dashboard/doctor/appointments">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </Link>
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-6">
            <PatientsHeader 
              patientCount={filteredPatients.length}
            />

            <PatientsSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient._id}
                    patient={patient}
                    onViewPatient={handleViewPatient}
                    onViewMedicalFiles={handleViewMedicalFiles}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            ) : (
              <PatientsEmptyState
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm("")}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
