export async function addNotification(notification: { recipient: string; title: string; message: string; type: string; relatedId?: string }) {
  try {
    const { default: connectDB } = await import('@/lib/db')
    const { default: Notification } = await import('@/lib/models/Notification')
    
    await connectDB()
    await Notification.create(notification)
  } catch (error) {
    console.error('Failed to add notification:', error)
  }
}

export async function getNotifications(userId: string) {
  try {
    const { default: connectDB } = await import('@/lib/db')
    const { default: Notification } = await import('@/lib/models/Notification')
    
    await connectDB()
    return await Notification.find({ recipient: userId }).sort({ createdAt: -1 })
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return []
  }
}

export async function markAsRead(userId: string, notificationId: string) {
  try {
    const { default: connectDB } = await import('@/lib/db')
    const { default: Notification } = await import('@/lib/models/Notification')
    
    await connectDB()
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true }
    )
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}

export async function clearAllNotifications(userId: string) {
  try {
    const { default: connectDB } = await import('@/lib/db')
    const { default: Notification } = await import('@/lib/models/Notification')
    
    await connectDB()
    await Notification.deleteMany({ recipient: userId })
  } catch (error) {
    console.error('Failed to clear notifications:', error)
  }
}

export async function notifyAllAdmins(notification: { title: string; message: string; type: string; relatedId?: string }) {
  try {
    const { default: connectDB } = await import('@/lib/db')
    const { default: User } = await import('@/lib/models/User')
    
    await connectDB()
    const admins = await User.find({ role: 'admin', isActive: true }).select('_id email firstName lastName')
    
    console.log('Found admins:', admins.length, admins.map(a => ({ id: a._id.toString(), email: a.email })))
    
    if (admins.length === 0) {
      console.warn('No admin users found to notify')
      return
    }
    
    admins.forEach(admin => {
      const adminId = admin._id.toString()
      console.log('Adding notification for admin:', adminId, admin.email)
      addNotification({
        ...notification,
        recipient: adminId
      })
      console.log('Adding notification for admin:', adminId)
    })
  } catch (error) {
    console.error('Failed to notify admins:', error)
  }
}

export const NotificationEvents = {
  REMINDER_APPOINTMENT: 'reminder_appointment',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed'
}

export async function triggerNotificationWebhook(event: string, data: unknown) {
  try {
    console.log(`Notification webhook triggered: ${event}`, data)
    // Add webhook logic here if needed
  } catch (error) {
    console.error('Failed to trigger notification webhook:', error)
  }
}