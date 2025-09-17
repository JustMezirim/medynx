import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppointmentsTable } from "./appointments-table"
import { Calendar, Plus } from 'lucide-react'
import { getStatusColor, getPaymentStatusColor } from '@/components/ui/status-colors'

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

interface AppointmentsContentProps {
  appointments: Appointment[]
  selectedAppointments: string[]
  totalPages: number
  currentPage: number
  onSelectAll: (checked: boolean) => void
  onSelectAppointment: (appointmentId: string, checked: boolean) => void
  onViewDetails: (appointment: Appointment) => void
  onAction: (type: string, appointmentId?: string, value?: string) => void
  onPageChange: (page: number) => void
}

export function AppointmentsContent({
  appointments,
  selectedAppointments,
  totalPages,
  currentPage,
  onSelectAll,
  onSelectAppointment,
  onViewDetails,
  onAction,
  onPageChange
}: AppointmentsContentProps) {
  if (appointments.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
        <CardContent className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No appointments found</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            No appointments match your search criteria. Try adjusting your filters or create a new appointment.
          </p>
          <Button className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AppointmentsTable
        appointments={appointments}
        selectedAppointments={selectedAppointments}
        onSelectAll={onSelectAll}
        onSelectAppointment={onSelectAppointment}
        onViewDetails={onViewDetails}
        onAction={onAction}
        getStatusColor={getStatusColor}
        getPaymentStatusColor={getPaymentStatusColor}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="border-slate-200"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-slate-200"}
                >
                  {page}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-slate-200"
          >
            Next
          </Button>
        </div>
      )}
    </>
  )
}