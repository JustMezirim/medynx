import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Activity, Clock, Check } from "lucide-react"

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  todayAppointments: number
  revenue: number
}

interface AppointmentStatsProps {
  stats: Stats
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Cancelled</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <X className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.cancelled}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Cancelled appointments</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Today&apos;s Schedule</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.todayAppointments}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Appointments today</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Pending</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.pending}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Need attention</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Completed</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Check className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completed}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Consultations done</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}