import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, DollarSign, TrendingUp, Activity } from "lucide-react"

interface DashboardStats {
  todayAppointments: number
  totalPatients: number
  monthlyEarnings: number
  completedAppointments: number
}

interface StatsCardsProps {
  stats: DashboardStats | null
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Today&apos;s Schedule</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Calendar className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.todayAppointments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <Activity className="h-3 w-3 mr-1" />
            <span>Appointments today</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Patients</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalPatients || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Unique patients</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Monthly Revenue</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₦{stats?.monthlyEarnings || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>This month</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Completed</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.completedAppointments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Sessions done</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}