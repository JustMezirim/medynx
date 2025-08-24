import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin } from "lucide-react"

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
}

interface PatientInfoCardProps {
  patient: Patient
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
            <Badge variant="secondary">{patient.gender}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-slate-500" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-slate-500" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Born: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
        </div>
        {patient.address && (
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span>{patient.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}