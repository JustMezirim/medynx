import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, X } from "lucide-react"
import Image from "next/image"

interface Appointment {
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
  symptoms?: string
  amount: number
  zoomJoinUrl?: string
}

interface UpcomingAppointmentCardProps {
  appointment: Appointment
  onCancel: (id: string) => void
  onJoinMeeting: (url: string) => void
  canJoinMeeting: boolean
  canCancel: boolean
}

export function UpcomingAppointmentCard({ 
  appointment, 
  onCancel, 
  onJoinMeeting, 
  canJoinMeeting, 
  canCancel 
}: UpcomingAppointmentCardProps) {
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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Image
                  src={`/placeholder.svg?height=64&width=64&query=doctor`}
                  alt="Doctor"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-blue-500">
                <Video className="h-3 w-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-bold text-xl text-gray-900">
                  Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                </h3>
                <Badge className={`${getStatusColor(appointment.status)} px-3 py-1`}>
                  {appointment.status}
                </Badge>
              </div>

              <p className="text-blue-600 font-semibold capitalize mb-3">{appointment.doctor.specialization}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.timeSlot}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600 font-bold">₦{appointment.amount}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Video Call
                  </span>
                </div>
              </div>

              {appointment.symptoms && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-700">Symptoms:</span>
                    <span className="text-gray-600 ml-2">{appointment.symptoms}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {canJoinMeeting && appointment.zoomJoinUrl && (
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => onJoinMeeting(appointment.zoomJoinUrl!)}
              >
                <Video className="h-5 w-5 mr-2" />
                Join Now
              </Button>
            )}

            {canCancel && (
              <Button 
                variant="outline" 
                className="border-red-200 hover:bg-red-50" 
                onClick={() => onCancel(appointment._id)}
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}