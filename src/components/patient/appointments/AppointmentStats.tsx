import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, FileText } from "lucide-react"

interface AppointmentStatsProps {
  upcomingCount: number
  completedCount: number
  totalCount: number
}

export function AppointmentStats({ upcomingCount, completedCount, totalCount }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Upcoming</p>
              <p className="text-3xl font-bold">{upcomingCount}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Completed</p>
              <p className="text-3xl font-bold">{completedCount}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">This Month</p>
              <p className="text-3xl font-bold">{totalCount}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        </CardContent>
      </Card>
    </div>
  )
}