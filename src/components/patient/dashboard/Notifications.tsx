"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { useNotifications } from "@/hooks/patient/use-notifications"
import { getNotificationStatusColor } from "@/components/ui/status-colors"


export function Notifications() {
  const { data: notifications = [], isLoading } = useNotifications()

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => {
              const colors = getNotificationStatusColor(notification.type)
              return (
                <div key={notification._id} className={`flex items-start space-x-3 p-3 rounded-lg ${colors.bg}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${colors.dot} ${!notification.isRead ? 'animate-pulse' : ''}`}></div>
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}