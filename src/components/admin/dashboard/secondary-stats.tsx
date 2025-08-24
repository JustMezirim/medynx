import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Activity, Clock, CheckCircle, TrendingUp } from "lucide-react"

interface SecondaryStatsProps {
  totalRevenue?: number
  activeUsers?: number
  pendingApprovals?: number
  completedAppointments?: number
}

export function SecondaryStats({ totalRevenue, activeUsers, pendingApprovals, completedAppointments }: SecondaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">₦{totalRevenue?.toLocaleString() || 0}</p>
              <div className="flex items-center mt-2 text-xs text-slate-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>All time earnings</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-blue-600">{activeUsers || 0}</p>
              <div className="flex items-center mt-2 text-xs text-slate-500">
                <Activity className="h-3 w-3 mr-1" />
                <span>Currently online</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-600">{pendingApprovals || 0}</p>
              <div className="flex items-center mt-2 text-xs text-slate-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Awaiting review</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedAppointments || 0}</p>
              <div className="flex items-center mt-2 text-xs text-slate-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Successful appointments</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}