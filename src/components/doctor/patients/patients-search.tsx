import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface PatientsSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function PatientsSearch({ searchTerm, onSearchChange }: PatientsSearchProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <Button variant="outline" size="default" className="border-slate-200 dark:border-slate-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}