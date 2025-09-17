"use client"

import {, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackNavigation } from "@/components/doctor/patients/back-navigation"
import { PatientInfoCard } from "@/components/doctor/patients/patient-info-card"
import { AppointmentHistory } from "@/components/doctor/patients/appointment-history"
import { LoadingSpinner } from "@/components/admin"
import { PatientNotFound } from "@/components/doctor/patients/patient-not-found"
import { showToast } from "@/components/ui/toast-helper"

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
}

interface Appointment {
  _id: string
  date: string
  timeSlot: string
  status: string
  type: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPatientDetails = useCallback(async () => {
    try {
      const [patientRes, appointmentsRes] = await Promise.all([
        fetch(`/api/doctor/patients/${patientId}`),
        fetch(`/api/appointment?patientId=${patientId}`)
      ])

      if (patientRes.ok) {
        const patientData = await patientRes.json()
        setPatient(patientData.patient)
      }

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json()
        setAppointments(appointmentsData.appointments || [])
      }
    } catch (error) {
      console.error("Error fetching patient details:", error)
      showToast.error("Failed to load patient details")
    } finally {
      setLoading(false)
    }
  }, [patientId])(() => {
    if (patientId) {
      fetchPatientDetails()
    }
  }, [patientId, fetchPatientDetails])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!patient) {
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
            <AppointmentHistory appointments={appointments} getStatusColor={getStatusColor} />
          </div>
        </main>
      </div>
    </div>
  )
}