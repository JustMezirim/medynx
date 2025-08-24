import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Notification from "@/lib/models/Notification"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    await connectDB()

    const notifications = await Notification.find({ recipient: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({ notifications })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    const { recipient, title, message, type, relatedId, relatedModel } = await request.json()

    await connectDB()

    const notification = new Notification({
      recipient: recipient || decoded.userId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    })

    await notification.save()
    return NextResponse.json({ notification })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}