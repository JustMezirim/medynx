import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Server, Database, Wrench, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface SystemStatusProps {
  systemStatus?: {
    server: string
    database: string
    maintenance: string
  }
}

export function SystemStatus({ systemStatus }: SystemStatusProps) {
  if (!systemStatus) {
    return (
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
        <CardContent className="p-6">
          <div className="h-32 bg-slate-300 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
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

  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-lg font-semibold">System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex justify-between items-center p-4 rounded-xl border ${
          systemStatus?.server === 'online' 
            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              systemStatus?.server === 'online' ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              <Server className="h-4 w-4 text-white" />
            </div>
            <span className={`font-medium ${
              systemStatus?.server === 'online' 
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-red-800 dark:text-red-300'
            }`}>Server Status</span>
          </div>
          <Badge className={systemStatus?.server === 'online'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
          }>
            {getSystemStatusIcon(systemStatus?.server || '')}
            <span className="ml-1 capitalize">{systemStatus?.server || 'unknown'}</span>
          </Badge>
        </div>
        
        <div className={`flex justify-between items-center p-4 rounded-xl border ${
          systemStatus.database === 'connected'
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'
            : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              systemStatus.database === 'connected' ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className={`font-medium ${
              systemStatus.database === 'connected'
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-red-800 dark:text-red-300'
            }`}>Database</span>
          </div>
          <Badge className={systemStatus.database === 'connected'
            ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800'
            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800'
          }>
            {getSystemStatusIcon(systemStatus.database)}
            <span className="ml-1 capitalize">{systemStatus.database}</span>
          </Badge>
        </div>
        
        <div className={`flex justify-between items-center p-4 rounded-xl border ${
          systemStatus.maintenance === 'none'
            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              systemStatus.maintenance === 'none' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}>
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className={`font-medium ${
              systemStatus.maintenance === 'none'
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-amber-800 dark:text-amber-300'
            }`}>Maintenance</span>
          </div>
          <Badge className={systemStatus.maintenance === 'none'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800'
          }>
            {systemStatus.maintenance === 'none' ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <Clock className="h-3 w-3 mr-1" />
            )}
            <span className="capitalize">{systemStatus.maintenance === "none" ? "Normal" : systemStatus.maintenance}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}