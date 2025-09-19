"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BookAppointment } from "@/components/book-appointment"
import { DoctorProfile, DoctorTabs } from "@/components/patient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { usePatientDoctor } from '@/hooks/patient/use-patient-doctors'

import Link from "next/link"



interface Review {
  _id: string
  patientName: string
  rating: number
  comment: string
  date: string
}

export default function DoctorProfilePage() {
  const params = useParams()
  const doctorId = params.id as string
  const [reviews] = useState<Review[]>([])

  const { data: doctor, isLoading } = usePatientDoctor(doctorId)
  const [showBooking, setShowBooking] = useState(false)



  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar userRole="patient" userName="Patient" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader  />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="animate-pulse space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar userRole="patient" userName="Patient" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor Not Found</h3>
                <p className="text-gray-600 mb-4">The doctor profile you&apos;re looking for doesn&apos;t exist.</p>
                <Link href='/dashboard/patient/doctors'>
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Doctors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  if (showBooking) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar userRole="patient" userName="Patient" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader 
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Button 
                variant="outline" 
                onClick={() => setShowBooking(false)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
              <BookAppointment doctorId={doctorId} />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar userRole="patient" userName="Patient" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
          // subtitle={`${doctor.specialization} • ${doctor.experience} years experience`} 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-10xl mx-auto space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/patient/doctors">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Doctors
              </Button>
            </Link>

            <DoctorProfile doctor={doctor} onBookAppointment={() => setShowBooking(true)} />
            <DoctorTabs doctor={doctor} reviews={reviews} />
          </div>
        </main>
      </div>
    </div>
  )
}

