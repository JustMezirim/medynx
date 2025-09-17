import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, Plus } from "lucide-react"

interface Specialization {
  _id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
}

interface SpecializationManagementProps {
  specializations: Specialization[]
  onAddSpecialization: () => void
}

export function SpecializationManagement({ specializations, onAddSpecialization }: SpecializationManagementProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            Medical Specializations
          </div>
          <Button onClick={onAddSpecialization} className="bg-teal-600 hover:bg-teal-700 text-white px-4 h-10">
            <Plus className="h-4 w-4 mr-2" />
            Add Specialization
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage medical specializations available for doctors to select during registration.
            </p>
          </div>
          {specializations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {specializations.map((spec) => (
                <div key={spec._id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 capitalize">{spec.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{spec.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}