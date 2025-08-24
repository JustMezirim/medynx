import { Card, CardContent } from "@/components/ui/card"
import { User, Stethoscope, Star } from "lucide-react"

interface ProfileStatsProps {
  totalPatients: number
  totalConsultations: number
  rating: number
}

export function ProfileStats({ totalPatients, totalConsultations, rating }: ProfileStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPatients}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalConsultations}</p>
              <p className="text-sm text-gray-600">Consultations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}