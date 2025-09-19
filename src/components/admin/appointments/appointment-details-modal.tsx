import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Video } from 'lucide-react'
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

interface AppointmentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onAction: (type: string, appointmentId?: string, value?: string) => void
}

export function AppointmentDetailsModal({ 
  open, 
  onOpenChange, 
  appointment, 
  onAction 
}: AppointmentDetailsModalProps) {
  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                Patient
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                  {appointment.status}
                </Badge>
                <Badge className={`${getPaymentStatusColor(appointment.paymentStatus)} border font-medium`}>
                  {appointment.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Doctor</label>
                  <p className="text-lg font-semibold">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                  <p className="text-sm text-slate-600">{appointment.doctor.specialization}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Date & Time</label>
                  <p className="text-lg font-semibold">{new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600">{appointment.timeSlot}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Type</label>
                  <p className="text-lg font-semibold capitalize">{appointment.type}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Amount</label>
                  <p className="text-lg font-semibold text-green-600">₦{appointment.amount}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Symptoms</label>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {appointment.symptoms || 'No symptoms recorded'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Diagnosis</label>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {appointment.diagnosis || 'No diagnosis recorded'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Prescription</label>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {appointment.prescription || 'No prescription recorded'}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Payment Status</label>
                    <Badge className={`${getPaymentStatusColor(appointment.paymentStatus)} border font-medium`}>
                      {appointment.paymentStatus}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Amount</label>
                    <p className="text-lg font-semibold text-green-600">₦{appointment.amount}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Created</label>
                  <p className="text-sm">{new Date(appointment.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {appointment.status === 'scheduled' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => onAction('update', appointment._id, 'completed')}
              >
                Mark Completed
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onAction('zoom', appointment._id)}
              >
                <Video className="h-4 w-4 mr-2" />
                Create Meeting
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}