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
      case 'appointment': return 'bg-blue-50'
      case 'payment': return 'bg-green-50'
      case 'system': return 'bg-purple-50'
      case 'reminder': return 'bg-yellow-50'
      default: return 'bg-gray-50'
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
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          <span>Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
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
          <p className="text-sm text-gray-600 text-center py-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className={`flex items-start space-x-3 p-3 rounded-lg ${getTypeColor(notification.type)}`}>
                <div className={`w-2 h-2 rounded-full mt-2 ${getDotColor(notification.type)} ${!notification.isRead ? 'animate-pulse' : ''}`}></div>
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
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