import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
// import { getNotifications, markAsRead } from "@/lib/notifications"

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const { default: connectDB } = await import('@/lib/db')
    const { default: Notification } = await import('@/lib/models/Notification')
    
    await connectDB()
    await Notification.updateMany(
      { recipient: decoded.userId, isRead: false },
      { isRead: true }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}