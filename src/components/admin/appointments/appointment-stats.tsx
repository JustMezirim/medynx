import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CalendarCheck, CheckCircle, XCircle, Activity, DollarSign, TrendingUp } from "lucide-react"

interface AppointmentStats {
  total: number
  scheduled: number
  completed: number
  cancelled: number
  todayAppointments: number
  totalRevenue: number
}

interface AppointmentStatsProps {
  stats: AppointmentStats
}

export function AppointmentStatsCards({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Appointments</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Calendar className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>All time</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Scheduled</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <CalendarCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.scheduled}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Upcoming appointments</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Completed</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completed}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Cancelled</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <XCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.cancelled}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Cancelled bookings</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Today</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.todayAppointments}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Today"s schedule</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Revenue</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <DollarSign className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₦{stats.totalRevenue}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Total earnings</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}