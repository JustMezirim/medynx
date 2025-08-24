import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, User, ExternalLink, Check, FileText, Eye, X } from "lucide-react"

interface Appointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar?: string
  }
  date: string
  timeSlot: string
  status: string
  type: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  amount: number
  zoomJoinUrl?: string
  zoomPassword?: string
}

interface AppointmentCardProps {
  appointment: Appointment
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  canJoinMeeting: (appointment: Appointment) => boolean
  onUpdateAppointment: (id: string, updates: unknown) => void
  onViewDetails: (appointment: Appointment) => void
}

export function AppointmentCard({
  appointment,
  getStatusColor,
  getStatusIcon,
  canJoinMeeting,
  onUpdateAppointment,
  onViewDetails
}: AppointmentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 h-64 w-full">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Avatar className="h-8 w-8">
              <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Badge className={`${getStatusColor(appointment.status)} border text-xs`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(appointment.status)}
                <span className="capitalize">{appointment.status}</span>
              </div>
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </h3>
            <p className="text-xs text-gray-500 truncate">{appointment.patient.email}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{new Date(appointment.date).toLocaleDateString("en-US", { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>{appointment.timeSlot}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {appointment.type === "video" ? (
                <Video className="h-3 w-3 text-blue-600" />
              ) : (
                <User className="h-3 w-3 text-green-600" />
              )}
              <span className="capitalize">{appointment.type}</span>
            </div>
            <span className="font-semibold text-green-600">₦{appointment.amount}</span>
          </div>
          
          {appointment.notes && (
            <div className="p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-600 line-clamp-2">
                {appointment.notes.length > 50 ? `${appointment.notes.substring(0, 50)}...` : appointment.notes}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-1">
            {canJoinMeeting(appointment) && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 h-6 px-2 text-xs"
                onClick={() => window.open(appointment.zoomJoinUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            {appointment.status === "pending" && (
              <Button
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onUpdateAppointment(appointment._id, { status: "confirmed" })}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs"
                onClick={() => onViewDetails(appointment)}
              >
                <FileText className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => onViewDetails(appointment)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            {(appointment.status === "pending" || appointment.status === "confirmed") && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onUpdateAppointment(appointment._id, { status: "cancelled" })}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}