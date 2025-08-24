import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Eye, FileText, Activity } from "lucide-react"

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  lastAppointment: string
  appointmentsCount: number
  lastStatus: string
}

interface PatientCardProps {
  patient: Patient
  onViewPatient: (id: string) => void
  onViewMedicalFiles: (id: string) => void
  getStatusColor: (status: string) => string
}

export function PatientCard({ patient, onViewPatient, onViewMedicalFiles, getStatusColor }: PatientCardProps) {
  return (
    <Card className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Activity className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {patient.firstName} {patient.lastName}
              </h3>
              <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {patient.gender}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={() => onViewPatient(patient._id)}
              title="View Patient Details"
            >
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-slate-50 dark:hover:bg-slate-700"
              onClick={() => onViewMedicalFiles(patient._id)}
              title="View Medical Files"
            >
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 truncate">{patient.email}</span>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              Born: {new Date(patient.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Visits: {patient.appointmentsCount}
            </span>
            <Badge className={`${getStatusColor(patient.lastStatus)} border-0 font-medium`}>
              {patient.lastStatus}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Last visit:</span>
            <span className="font-medium">
              {new Date(patient.lastAppointment).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}