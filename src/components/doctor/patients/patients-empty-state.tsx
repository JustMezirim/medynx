import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface PatientsEmptyStateProps {
  searchTerm: string
  onClearSearch: () => void
}

export function PatientsEmptyState({ searchTerm, onClearSearch }: PatientsEmptyStateProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No patients found
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {searchTerm
            ? "No patients match your search criteria. Try adjusting your search terms."
            : "No patients have appointments with you yet. Patients will appear here after their first appointment."}
        </p>
        {searchTerm && (
          <Button 
            variant="outline" 
            onClick={onClearSearch} 
            className="mt-4 border-slate-200 dark:border-slate-700"
          >
            Clear search
          </Button>
        )}
      </CardContent>
    </Card>
  )
}