import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Stethoscope, Plus } from "lucide-react"
import Link from "next/link"

interface RecentAppointment {
  _id: string
  doctor: {
    firstName: string
    lastName: string
    specialization: string
  }
  date: string
  timeSlot: string
  status: string
  type: string
}

interface RecentAppointmentsProps {
  appointments: RecentAppointment[]
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="lg:col-span-2 border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Recent Appointments</span>
            </CardTitle>
            <CardDescription>Your latest medical consultations</CardDescription>
          </div>
          <Link href="/dashboard/patient/appointments">
            <Button variant="outline" size="sm" className="hover:bg-blue-50">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.slice(0, 4).map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    appointment.type === "video" ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    {appointment.type === "video" ? (
                      <Video className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Stethoscope className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">{appointment.doctor.specialization}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(appointment.status)} px-3 py-1`}>{appointment.status}</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">No appointments yet</p>
              <Link href="/dashboard/patient/doctors">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}