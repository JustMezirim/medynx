import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, ChevronRight } from "lucide-react"
import Link from "next/link"

interface TodayAppointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
  }
  timeSlot: string
  status: string
  type: string
  symptoms?: string
}

interface TodaysScheduleProps {
  appointments: TodayAppointment[]
  getStatusColor: (status: string) => string
}

export function TodaysSchedule({ appointments, getStatusColor }: TodaysScheduleProps) {
  return (
    <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Today"s Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </div>
          <Link href="/dashboard/doctor/appointments">
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
            appointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {appointment.type === "video" ? (
                      <Video className="h-6 w-6 text-white" />
                    ) : (
                      <Users className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.timeSlot}
                    </p>
                    {appointment.symptoms && (
                      <p className="text-sm text-slate-500 truncate max-w-64 mt-1">{appointment.symptoms}</p>
                    )}
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No appointments today</h3>
              <p className="text-slate-600 dark:text-slate-400">Your schedule is clear for today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}