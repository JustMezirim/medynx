import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Calendar, CalendarCheck, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  totalAppointments: number
  todayAppointments: number
  patientsGrowth?: number
  doctorsGrowth?: number
  appointmentsGrowth?: number
}

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Patients</p>
              <p className="text-3xl font-bold">{stats.totalPatients.toLocaleString()}</p>
              {stats.patientsGrowth !== undefined && (
                <div className="flex items-center space-x-1 mt-3">
                  <div className={`p-1 rounded-full ${stats.patientsGrowth > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {stats.patientsGrowth > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-emerald-300" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium opacity-90">
                    {Math.abs(stats.patientsGrowth)}%
                  </span>
                  <span className="text-xs opacity-70">vs last month</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl shadow-lg">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Doctors</p>
              <p className="text-3xl font-bold">{stats.totalDoctors.toLocaleString()}</p>
              {stats.doctorsGrowth !== undefined && (
                <div className="flex items-center space-x-1 mt-3">
                  <div className={`p-1 rounded-full ${stats.doctorsGrowth > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {stats.doctorsGrowth > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-emerald-300" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium opacity-90">
                    {Math.abs(stats.doctorsGrowth)}%
                  </span>
                  <span className="text-xs opacity-70">vs last month</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl shadow-lg">
              <UserCheck className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Appointments</p>
              <p className="text-3xl font-bold">{stats.totalAppointments.toLocaleString()}</p>
              {stats.appointmentsGrowth !== undefined && (
                <div className="flex items-center space-x-1 mt-3">
                  <div className={`p-1 rounded-full ${stats.appointmentsGrowth > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {stats.appointmentsGrowth > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-emerald-300" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium opacity-90">
                    {Math.abs(stats.appointmentsGrowth)}%
                  </span>
                  <span className="text-xs opacity-70">vs last month</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-xl shadow-lg">
              <Calendar className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Today's Appointments</p>
              <p className="text-3xl font-bold">{stats.todayAppointments}</p>
              <p className="text-xs opacity-70 mt-3">Scheduled for today</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl shadow-lg">
              <CalendarCheck className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      </Card>
    </div>
  )
}