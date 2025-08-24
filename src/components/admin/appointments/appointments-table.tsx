import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, Stethoscope, Calendar, Clock, Video, User, MoreHorizontal, Eye, Edit, CheckCircle, XCircle, Trash2 } from "lucide-react"

interface Appointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  doctor: {
    firstName: string
    lastName: string
    specialization: string
    consultationFee?: number
  }
  date: string
  timeSlot: string
  status: string
  type: string
  amount: number
  paymentStatus: string
  createdAt: string
  meetingLink?: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

interface AppointmentsTableProps {
  appointments: Appointment[]
  selectedAppointments: string[]
  onSelectAll: (checked: boolean) => void
  onSelectAppointment: (id: string, checked: boolean) => void
  onViewDetails: (appointment: Appointment) => void
  onAction: (type: string, appointmentId?: string, value?: string) => void
  getStatusColor: (status: string) => string
  getPaymentStatusColor: (status: string) => string
}

export function AppointmentsTable({
  appointments,
  selectedAppointments,
  onSelectAll,
  onSelectAppointment,
  onViewDetails,
  onAction,
  getStatusColor,
  getPaymentStatusColor
}: AppointmentsTableProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Checkbox
                    checked={selectedAppointments.length === appointments.length && appointments.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
                    <Checkbox
                      checked={selectedAppointments.includes(appointment._id)}
                      onCheckedChange={(checked) =>
                        onSelectAppointment(appointment._id, checked as boolean)
                      }
                      className="border-slate-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4 ring-2 ring-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                          {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {appointment.patient.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {appointment.doctor.specialization}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.timeSlot}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${appointment.type === "video" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                        {appointment.type === "video" ? (
                          <Video className="h-3 w-3 text-blue-600" />
                        ) : (
                          <User className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <span className="text-sm capitalize font-medium">{appointment.type}</span>
                    </div>
                    {appointment.meetingLink && (
                      <div className="text-xs text-emerald-600 mt-1 font-medium">Meeting Ready</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                      {appointment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getPaymentStatusColor(appointment.paymentStatus)} border font-medium`}>
                      {appointment.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ₦{appointment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {appointment.status === "scheduled" && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Appointment
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {appointment.status === "scheduled" && (
                          <DropdownMenuItem
                            onClick={() => onAction("update", appointment._id, "completed")}
                            className="text-emerald-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Completed
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "scheduled" && (
                          <DropdownMenuItem
                            onClick={() => onAction("update", appointment._id, "cancelled")}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        )}
                        {appointment.type === "video" && !appointment.meetingLink && appointment.status === "scheduled" && (
                          <DropdownMenuItem
                            onClick={() => onAction("zoom", appointment._id)}
                            className="text-blue-600"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Create Meeting
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onAction("delete", appointment._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
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