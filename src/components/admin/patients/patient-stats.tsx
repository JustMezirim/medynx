import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Activity, Calendar, TrendingUp } from "lucide-react"

interface PatientStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  totalAppointments: number
}

interface PatientStatsProps {
  stats: PatientStats
}

export function PatientStatsCards({ stats }: PatientStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Patients</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>All registered</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Active</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <UserCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.active}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>{stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Inactive</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <UserX className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.inactive}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Deactivated accounts</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">New This Month</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.newThisMonth}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Recent registrations</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Appointments</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Calendar className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalAppointments}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>All time bookings</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}