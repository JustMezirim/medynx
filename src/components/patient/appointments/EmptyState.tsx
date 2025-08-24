import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Plus } from "lucide-react"

interface EmptyStateProps {
  type: "upcoming" | "past"
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === "upcoming") {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
          <p className="text-gray-600 mb-6">Book your next appointment with a qualified doctor</p>
          <Button onClick={() => window.location.href = '/dashboard/patient/doctors'} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No past appointments</h3>
        <p className="text-gray-600">Your completed appointments will appear here</p>
      </CardContent>
    </Card>
  )
}