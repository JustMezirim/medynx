import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Heart } from 'lucide-react'

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
  isActive: boolean
  createdAt: string
  appointmentCount: number
  lastAppointment?: string
  profileImage?: string
  emergencyContact?: string
  medicalHistory?: string[]
  totalSpent?: number
}

interface PatientDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onEdit: (patient: Patient) => void
  calculateAge: (dateOfBirth: string) => number
}

export function PatientDetailsModal({ 
  open, 
  onOpenChange, 
  patient, 
  onEdit,
  calculateAge
}: PatientDetailsModalProps) {
  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Patient Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarImage src={patient.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-lg font-semibold">
                {patient.firstName[0]}{patient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                {patient.gender} • {calculateAge(patient.dateOfBirth)} years old
              </p>
              <Badge className={`${patient.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} border font-medium mt-2`}>
                {patient.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                  <p className="text-lg font-semibold">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Gender</label>
                  <p className="text-lg font-semibold capitalize">{patient.gender}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Total Appointments</label>
                  <p className="text-lg font-semibold text-purple-600">{patient.appointmentCount}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Total Spent</label>
                  <p className="text-lg font-semibold text-green-600">₦{patient.totalSpent || 0}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Last Appointment</label>
                <p className="text-lg font-semibold">{patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : 'No appointments yet'}</p>
              </div>
            </TabsContent>
            
            <TabsContent value='contact' className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{patient.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">{patient.phone}</span>
                </div>
                {patient.address && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{patient.address}</span>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Phone className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 block">Emergency Contact</span>
                      <span className="font-medium">{patient.emergencyContact}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500">Medical History</label>
                  {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {patient.medicalHistory.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                            <Heart className="h-3 w-3 text-red-600" />
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">No medical history recorded</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Registration Date</label>
                  <p className="text-lg font-semibold">{new Date(patient.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={() => onEdit(patient)}>
            Edit Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}