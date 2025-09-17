import { NextRequest, NextResponse } from "next/server"
import  connectDB  from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { triggerNotificationWebhook, NotificationEvents } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - in production, use proper API key
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find appointments for tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const appointments = await Appointment.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      status: "confirmed"
    })

    // Send reminders for each appointment
    for (const appointment of appointments) {
      await triggerNotificationWebhook(NotificationEvents.REMINDER_APPOINTMENT, {
        appointmentId: appointment._id.toString()
      })
    }

    return NextResponse.json({ 
      message: `Sent ${appointments.length} appointment reminders`,
      count: appointments.length 
    })
  } catch (error) {
    console.error("Reminder job failed:", error)
    return NextResponse.json({ error: "Reminder job failed" }, { status: 500 })
  }
}