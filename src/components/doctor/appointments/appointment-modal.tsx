import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Mail, Phone, Check } from "lucide-react"

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

interface AppointmentModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onComplete: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AppointmentModal({ appointment, isOpen, onClose, onComplete }: AppointmentModalProps) {
  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>
              {appointment.status === "completed" ? "Appointment Details" : "Complete Consultation"}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={appointment.patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                    {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{appointment.patient.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.patient.phone}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date</Label>
                  <p className="text-sm">{new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>Time</Label>
                  <p className="text-sm">{appointment.timeSlot}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                  <p className="text-sm capitalize">{appointment.type} Consultation</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                  <p className="text-sm font-semibold text-green-600">₦{appointment.amount}</p>
                </div>
              </div>
              
              {appointment.symptoms && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Symptoms</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{appointment.symptoms}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {appointment.status === "completed" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointment.diagnosis && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Diagnosis</Label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{appointment.diagnosis}</p>
                  </div>
                )}
                {appointment.prescription && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Prescription</Label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{appointment.prescription}</p>
                  </div>
                )}
                {appointment.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Notes</Label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{appointment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onComplete} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis *</Label>
                    <Textarea
                      id="diagnosis"
                      name="diagnosis"
                      rows={3}
                      placeholder="Enter diagnosis..."
                      defaultValue={appointment.diagnosis || ""}
                      required
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prescription">Prescription</Label>
                    <Textarea
                      id="prescription"
                      name="prescription"
                      rows={4}
                      placeholder="Enter prescription details..."
                      defaultValue={appointment.prescription || ""}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      placeholder="Any additional notes..."
                      defaultValue={appointment.notes || ""}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Complete Consultation
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}