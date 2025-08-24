import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

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

interface AppointmentHistoryProps {
  appointments: Appointment[]
  getStatusColor: (status: string) => string
}

export function AppointmentHistory({ appointments, getStatusColor }: AppointmentHistoryProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Appointment History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600">{appointment.timeSlot} • {appointment.type}</p>
                  {appointment.symptoms && (
                    <p className="text-sm text-slate-500 mt-1">Symptoms: {appointment.symptoms}</p>
                  )}
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No appointments found</p>
        )}
      </CardContent>
    </Card>
  )
}