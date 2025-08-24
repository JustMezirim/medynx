"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

interface Notification {
  _id: string
  title: string
  message: string
  type: "appointment" | "payment" | "system" | "reminder"
  isRead: boolean
  createdAt: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications.slice(0, 3))
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-50 dark:bg-blue-900/20'
      case 'payment': return 'bg-green-50 dark:bg-green-900/20'
      case 'system': return 'bg-purple-50 dark:bg-purple-900/20'
      case 'reminder': return 'bg-yellow-50 dark:bg-yellow-900/20'
      default: return 'bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getDotColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-500'
      case 'payment': return 'bg-green-500'
      case 'system': return 'bg-purple-500'
      case 'reminder': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className={`flex items-center p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${getDotColor(notification.type)} ${!notification.isRead ? 'animate-pulse' : ''}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{notification.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}