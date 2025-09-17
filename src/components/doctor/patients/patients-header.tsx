import { Users } from "lucide-react"

interface PatientsHeaderProps {
  patientCount: number
}

export function PatientsHeader({ patientCount }: PatientsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Patient Records
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {patientCount} patient{patientCount !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  )
}