import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Notification from "@/lib/models/Notification"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    await connectDB()

    await Notification.updateMany(
      { recipient: decoded.userId, isRead: false },
      { isRead: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}