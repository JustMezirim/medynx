import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
        <p className="text-gray-600 mb-6">No appointments match your current filters.</p>
        <Button onClick={onClearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}