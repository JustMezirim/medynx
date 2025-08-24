import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Notification from "@/lib/models/Notification"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    await connectDB()

    // Create test notifications
    const testNotifications = [
      {
        recipient: decoded.userId,
        title: "Welcome to Medynx!",
        message: "Your account has been successfully created. Start booking appointments with verified doctors.",
        type: "system"
      },
      {
        recipient: decoded.userId,
        title: "Appointment Reminder",
        message: "You have an upcoming appointment tomorrow at 2:00 PM with Dr. Smith.",
        type: "reminder"
      },
      {
        recipient: decoded.userId,
        title: "Payment Successful",
        message: "Your payment of ₦15,000 for the appointment has been processed successfully.",
        type: "payment"
      }
    ]

    const notifications = await Notification.insertMany(testNotifications)

    return NextResponse.json({ 
      message: "Test notifications created",
      notifications 
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create test notifications" }, { status: 500 })
  }
}