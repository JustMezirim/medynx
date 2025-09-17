import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Activity, FileText, Heart, TrendingUp } from "lucide-react"

interface DashboardStats {
  upcomingAppointments: number
  totalAppointments: number
  medicalFiles: number
  favoriteDoctor: string
}

interface DashboardStatsProps {
  stats: DashboardStats | null
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Upcoming</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Calendar className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.upcomingAppointments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <Activity className="h-3 w-3 mr-1" />
            <span>Appointments</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Visits</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalAppointments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>All time</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Medical Files</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.medicalFiles || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Documents</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Health Score</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">85%</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Overall wellness</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}