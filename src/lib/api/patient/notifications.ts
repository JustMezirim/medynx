interface Notification {
  _id: string
  title: string
  message: string
  type: "appointment" | "payment" | "system" | "reminder"
  isRead: boolean
  createdAt: string
}

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await fetch('/api/notifications')
    if (!response.ok) throw new Error('Failed to fetch notifications')
    const data = await response.json()
    return data.notifications || []
  }
}

export type { Notification }