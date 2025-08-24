"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { SecondaryStats } from "@/components/admin/dashboard/secondary-stats"
import { SystemStatus } from "@/components/admin/dashboard/system-status"
import { LoadingSpinner } from "@/components/admin"
import { Target, CheckCircle, Timer, Star, Zap, FileText, Settings, AlertTriangle, BarChart3, Calendar, MoreHorizontal, Database, Clock } from 'lucide-react'
import { showToast } from '@/components/ui/toast-helper'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  totalAdmins?: number
  totalAppointments: number
  todayAppointments: number
  totalRevenue?: number
  pendingApprovals?: number
  activeUsers?: number
  completedAppointments?: number
  patientsGrowth?: number
  doctorsGrowth?: number
  appointmentsGrowth?: number
}

interface RecentAppointment {
  _id: string
  patient: {
    firstName: string
    lastName: string
  }
  doctor: {
    firstName: string
    lastName: string
  }
  date: string
  time: string
  status: string
}

interface AppointmentStat {
  _id: string
  count: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    completedAppointments: 0,
  })
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStat[]>([])
  const [systemStatus, setSystemStatus] = useState({
    server: 'online',
    database: 'connected',
    maintenance: 'none'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...')
      const [dashboardResponse, paymentsResponse] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/payments?limit=1")
      ])
      
      const dashboardData = await dashboardResponse.json()
      const paymentsData = await paymentsResponse.json()
      
      if (dashboardResponse.ok) {
        // Use real data if available, otherwise fallback to test data
        const statsData = dashboardData.stats || {
          totalPatients: 156,
          totalDoctors: 24,
          totalAppointments: 489,
          todayAppointments: 12,
          totalRevenue: 45250,
          activeUsers: 87,
          pendingApprovals: 5,
          completedAppointments: 432,
          patientsGrowth: 12.5,
          doctorsGrowth: 8.2,
          appointmentsGrowth: 15.7,
        }
        
        // Use revenue from payments API for consistency
        if (paymentsResponse.ok && paymentsData.stats) {
          statsData.totalRevenue = paymentsData.stats.totalRevenue
        }
        
        setStats(statsData)
        setRecentAppointments(dashboardData.recentAppointments || [])
        setAppointmentStats(dashboardData.appointmentStats || [
          { _id: "scheduled", count: 45 },
          { _id: "completed", count: 432 },
          { _id: "cancelled", count: 12 }
        ])
        setSystemStatus(dashboardData.systemStatus || {
          server: "online",
          database: "connected", 
          maintenance: Date.now() % 2 === 0 ? "none" : "scheduled"
        })
        console.log("Stats set:", statsData)
      } else {
        console.error("API error:", dashboardData.message)
        showToast.error(dashboardData.message || "Failed to load dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      showToast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      case "no-show":
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
    }
  }

  const getSystemStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "connected":
        return <Database className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return <LoadingSpinner title="Admin Dashboard" subtitle="System overview and management" message="Loading dashboard data..." />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Enhanced Header */}
          {/* <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">System overview and management center</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-slate-200">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Eye className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </div>
          </div> */}
          
          <StatsCards stats={stats} />

          <SecondaryStats 
            totalRevenue={stats.totalRevenue}
            activeUsers={stats.activeUsers}
            pendingApprovals={stats.pendingApprovals}
            completedAppointments={stats.completedAppointments}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SystemStatus systemStatus={systemStatus} />

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-lg font-semibold">Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    {stats.totalAppointments > 0 
                      ? Math.round(((stats.completedAppointments || 0) / stats.totalAppointments) * 100)
                      : 0}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <Timer className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Today"s Schedule</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{stats.todayAppointments} appts</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                      <Star className="h-3 w-3 text-amber-600" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pending Reviews</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.pendingApprovals || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-lg font-semibold">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" size="sm">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded mr-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  Generate Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-12 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" size="sm">
                  <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded mr-3">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  System Settings
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-12 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" size="sm">
                  <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded mr-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  View Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      Recent Appointments
                    </CardTitle>
                    <CardDescription className="mt-1">Latest appointment bookings</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                            {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">No recent appointments</h3>
                      <p className="text-slate-500 dark:text-slate-400">New appointments will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                      </div>
                      Appointment Analytics
                    </CardTitle>
                    <CardDescription className="mt-1">Status breakdown and trends</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointmentStats.length > 0 ? (
                  <>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Count",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[200px] mb-6"
                    >
                      <BarChart data={appointmentStats}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="_id" 
                          className="text-xs"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill="var(--color-count)"
                          radius={[6, 6, 0, 0]}
                          className="drop-shadow-sm"
                        />
                      </BarChart>
                    </ChartContainer>
                    
                    <div className="space-y-3">
                      {appointmentStats.map((stat) => (
                        <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Badge className={`${getStatusColor(stat._id)} border font-medium`} variant="outline">
                            {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">{stat.count}</span>
                            <span className="text-xs text-slate-500">appointments</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">No data available</h3>
                    <p className="text-slate-500 dark:text-slate-400">Analytics will appear when data is available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
