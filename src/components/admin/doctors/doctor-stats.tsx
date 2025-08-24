import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, UserX, TrendingUp } from "lucide-react"

interface DoctorStats {
  total: number
  verified: number
  pending: number
  active: number
  inactive: number
}

interface DoctorStatsProps {
  stats: DoctorStats
}

export function DoctorStatsCards({ stats }: DoctorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Doctors</CardTitle>
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
          <CardTitle className="text-sm font-medium opacity-90">Verified</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <UserCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.verified}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>{stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% of total</span>
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
            <span>Awaiting verification</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Active</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <UserCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.active}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Currently active</span>
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
    </div>
  )
}