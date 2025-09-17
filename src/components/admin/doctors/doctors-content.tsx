import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoctorsTable } from "./doctors-table"
import { Stethoscope, Plus } from 'lucide-react'

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

interface DoctorsContentProps {
  doctors: Doctor[]
  selectedDoctors: string[]
  totalPages: number
  currentPage: number
  onSelectAll: (checked: boolean) => void
  onSelectDoctor: (doctorId: string, checked: boolean) => void
  onViewDetails: (doctor: Doctor) => void
  onEditDoctor: (doctor: Doctor) => void
  onAction: (type: string, doctorId?: string, value?: boolean) => void
  onPageChange: (page: number) => void
  onAddDoctor: () => void
  getStatusColor: (isVerified: boolean, isActive: boolean) => string
  getStatusText: (isVerified: boolean, isActive: boolean) => string
}

export function DoctorsContent({
  doctors,
  selectedDoctors,
  totalPages,
  currentPage,
  onSelectAll,
  onSelectDoctor,
  onViewDetails,
  onEditDoctor,
  onAction,
  onPageChange,
  onAddDoctor,
  getStatusColor,
  getStatusText
}: DoctorsContentProps) {
  if (doctors.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
        <CardContent className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No doctors found</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            No doctors match your search criteria. Try adjusting your filters or add a new doctor.
          </p>
          <Button onClick={onAddDoctor} className="mt-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <DoctorsTable
        doctors={doctors}
        selectedDoctors={selectedDoctors}
        onSelectAll={onSelectAll}
        onSelectDoctor={onSelectDoctor}
        onViewDetails={onViewDetails}
        onEditDoctor={onEditDoctor}
        onAction={onAction}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
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