import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Star, MapPin, Stethoscope } from 'lucide-react'

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  licenseNumber: string
  experience: number
  rating: number
  consultationFee: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  totalPatients: number
  totalAppointments: number
  profileImage?: string
  address?: string
  bio?: string
  availability?: string[]
}

interface DoctorDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: Doctor | null
  onAction: (type: string, doctorId?: string, value?: boolean) => void
  onEdit: (doctor: Doctor) => void
  getStatusColor: (isVerified: boolean, isActive: boolean) => string
  getStatusText: (isVerified: boolean, isActive: boolean) => string
}

export function DoctorDetailsModal({ 
  open, 
  onOpenChange, 
  doctor, 
  onAction,
  onEdit,
  getStatusColor,
  getStatusText
}: DoctorDetailsModalProps) {
  if (!doctor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Doctor Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <Avatar className="h-16 w-16 ring-2 ring-white shadow-lg">
              <AvatarImage src={doctor.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                <Stethoscope className="h-4 w-4" />
                {doctor.specialization}
              </p>
              <Badge className={`${getStatusColor(doctor.isVerified, doctor.isActive)} border font-medium mt-2`}>
                {getStatusText(doctor.isVerified, doctor.isActive)}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Experience</label>
                  <p className="text-lg font-semibold">{doctor.experience} years</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold">{doctor.rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Consultation Fee</label>
                  <p className="text-lg font-semibold text-green-600">₦{doctor.consultationFee}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Total Patients</label>
                  <p className="text-lg font-semibold text-blue-600">{doctor.totalPatients}</p>
                </div>
              </div>
              {doctor.bio && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Bio</label>
                  <p className="text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{doctor.bio}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">{doctor.phone}</span>
                </div>
                {doctor.address && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">{doctor.address}</span>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="professional" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">License Number</label>
                    <p className="text-lg font-semibold">{doctor.licenseNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Total Appointments</label>
                    <p className="text-lg font-semibold text-purple-600">{doctor.totalAppointments}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Registration Date</label>
                  <p className="text-sm">{new Date(doctor.createdAt).toLocaleDateString('en-US', {
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
          <Button variant="outline" onClick={() => onEdit(doctor)}>
            Edit Doctor
          </Button>
          {!doctor.isVerified && (
            <Button onClick={() => onAction('verify', doctor._id, true)}>
              Verify Doctor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}