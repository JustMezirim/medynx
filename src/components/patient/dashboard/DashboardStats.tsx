import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Activity, FileText, Bell, Clock, TrendingUp } from "lucide-react"

interface DashboardStats {
  upcomingAppointments: number
  totalAppointments: number
  medicalFiles: number
}

interface DashboardStatsProps {
  stats: DashboardStats | null
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Upcoming Appointments</CardTitle>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700">{stats?.upcomingAppointments || 0}</div>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            Next 30 days
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total Appointments</CardTitle>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700">{stats?.totalAppointments || 0}</div>
          <p className="text-sm text-blue-600 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            All time
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Medical Files</CardTitle>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700">{stats?.medicalFiles || 0}</div>
          <p className="text-sm text-purple-600 flex items-center mt-1">
            <FileText className="h-3 w-3 mr-1" />
            Documents stored
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Reminders</CardTitle>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-700">5</div>
          <p className="text-sm text-orange-600 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </p>
        </CardContent>
      </Card>
    </div>
  )
}