import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, Stethoscope, Plus, ChevronRight } from "lucide-react"
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
    <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Appointments</CardTitle>
            <CardDescription>Your latest medical consultations</CardDescription>
          </div>
          <Link href="/dashboard/patient/appointments">
            <Button variant="outline" size="sm" className="border-slate-200">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.slice(0, 4).map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {appointment.type === "video" ? (
                      <Video className="h-6 w-6 text-white" />
                    ) : (
                      <Stethoscope className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                    </p>
                    <p className="text-sm text-slate-500 truncate max-w-64 mt-1">{appointment.doctor.specialization}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                  {appointment.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No appointments yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Book your first consultation</p>
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