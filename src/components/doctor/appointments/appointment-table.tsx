import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Video, User, ExternalLink, Check, FileText, Eye, X, MoreHorizontal } from "lucide-react"

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

interface AppointmentTableProps {
  appointments: Appointment[]
  getStatusColor: (status: string) => string
  canJoinMeeting: (appointment: Appointment) => boolean
  onUpdateAppointment: (id: string, updates: unknown) => void
  onViewDetails: (appointment: Appointment) => void
}

export function AppointmentTable({
  appointments,
  getStatusColor,
  canJoinMeeting,
  onUpdateAppointment,
  onViewDetails
}: AppointmentTableProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.timeSlot}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      {appointment.type === "video" ? (
                        <Video className="h-4 w-4 text-blue-600 mr-2" />
                      ) : (
                        <User className="h-4 w-4 text-green-600 mr-2" />
                      )}
                      <span className="capitalize">{appointment.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ₦{appointment.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-xs truncate">
                      {appointment.notes || 'No notes added'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canJoinMeeting(appointment) && (
                          <DropdownMenuItem onClick={() => window.open(appointment.zoomJoinUrl, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Join Meeting
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "pending" && (
                          <DropdownMenuItem 
                            onClick={() => onUpdateAppointment(appointment._id, { status: "confirmed" })}
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "confirmed" && (
                          <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(appointment.status === "pending" || appointment.status === "confirmed") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onUpdateAppointment(appointment._id, { status: "cancelled" })}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}