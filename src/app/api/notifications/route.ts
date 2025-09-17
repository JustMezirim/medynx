import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getNotifications, markAsRead, clearAllNotifications } from "@/lib/notifications"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const notifications = await getNotifications(payload.userId)

    return NextResponse.json({ notifications })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    const { notificationId } = await request.json()

    await markAsRead(payload.userId, notificationId)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    await clearAllNotifications(payload.userId)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}