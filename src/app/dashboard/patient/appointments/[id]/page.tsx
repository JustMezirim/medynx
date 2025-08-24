"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Calendar, Clock, Video, User, CheckCircle } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"

interface Appointment {
  _id: string
  date: string
  timeSlot: string
  symptoms: string
  type: string
  amount: number
  status: string
  paymentStatus: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  zoomJoinUrl?: string
}

export default function AppointmentDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchAppointment()
    }
    
    if (searchParams.get("success") === "payment_completed") {
      showToast.success("Payment completed successfully! Your appointment is confirmed.")
    }
  }, [params.id, searchParams])

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`/api/appointment/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAppointment(data.appointment)
      } else {
        showToast.error("Appointment not found")
      }
    } catch (error) {
      console.error("Error fetching appointment:", error)
      showToast.error("Failed to load appointment details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole="patient" userName="Patient" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole="patient" userName="Patient" />
        <div className="flex-1 flex items-center justify-center">
          <p>Appointment not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="patient" userName="Patient" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Appointment Details" subtitle="Your confirmed appointment" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Appointment Confirmed</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Doctor</p>
                      <p className="text-gray-600">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{appointment.timeSlot}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {appointment.type === "video" ? (
                    <Video className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">Consultation Type</p>
                    <p className="text-gray-600">{appointment.type === "video" ? "Video Call" : "In-person Visit"}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Symptoms/Reason</p>
                  <p className="text-gray-600">{appointment.symptoms}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount Paid:</span>
                    <span className="text-xl font-bold text-green-600">₦{appointment.amount}</span>
                  </div>
                </div>

                {appointment.zoomJoinUrl && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Video Call Link</p>
                    <Button asChild className="w-full">
                      <a href={appointment.zoomJoinUrl} target="_blank" rel="noopener noreferrer">
                        <Video className="h-4 w-4 mr-2" />
                        Join Video Call
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}