"use client"

import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackNavigation } from "@/components/doctor/patients/back-navigation"
import { PatientInfoCard } from "@/components/doctor/patients/patient-info-card"
import { AppointmentHistory } from "@/components/doctor/patients/appointment-history"
import { LoadingSpinner } from "@/components/admin"
import { PatientNotFound } from "@/components/doctor/patients/patient-not-found"
import { usePatientDetails } from "@/hooks/doctor/use-doctor-patients"
import { getAppointmentStatusColor } from "@/components/ui/status-colors"

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string

  const { data, isLoading, error } = usePatientDetails(patientId)
  const patient = data?.patient
  const appointments = data?.appointments || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !patient) {
    return <PatientNotFound />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar userRole="doctor" userName="Doctor" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title={`${patient.firstName} ${patient.lastName}`}
          // subtitle="Patient Details"
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-6">
            <BackNavigation />
            <PatientInfoCard patient={patient} />
            <AppointmentHistory appointments={appointments} getStatusColor={getAppointmentStatusColor} />
          </div>
        </main>
      </div>
    </div>
  )
}