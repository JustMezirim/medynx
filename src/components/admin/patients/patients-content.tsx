import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PatientsTable } from "./patients-table"
import { User, Plus } from 'lucide-react'

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

interface PatientsContentProps {
  patients: Patient[]
  selectedPatients: string[]
  totalPages: number
  currentPage: number
  onSelectAll: (checked: boolean) => void
  onSelectPatient: (patientId: string, checked: boolean) => void
  onViewDetails: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
  onAction: (type: string, patientId?: string, value?: boolean) => void
  onPageChange: (page: number) => void
  onAddPatient: () => void
  calculateAge: (dateOfBirth: string) => number
  searchTerm: string
  statusFilter: string
  genderFilter: string
}

export function PatientsContent({
  patients,
  selectedPatients,
  totalPages,
  currentPage,
  onSelectAll,
  onSelectPatient,
  onViewDetails,
  onEditPatient,
  onAction,
  onPageChange,
  onAddPatient,
  calculateAge,
  searchTerm,
  statusFilter,
  genderFilter
}: PatientsContentProps) {
  if (patients.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
        <CardContent className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No patients found</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {searchTerm || statusFilter !== "all" || genderFilter !== "all"
              ? "No patients match your search criteria. Try adjusting your filters."
              : "No patients have registered yet. Add the first patient to get started."}
          </p>
          {(!searchTerm && statusFilter === "all" && genderFilter === "all") && (
            <Button onClick={onAddPatient} className="mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Add First Patient
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <PatientsTable
        patients={patients}
        selectedPatients={selectedPatients}
        onSelectAll={onSelectAll}
        onSelectPatient={onSelectPatient}
        onViewDetails={onViewDetails}
        onEditPatient={onEditPatient}
        onAction={onAction}
        calculateAge={calculateAge}
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