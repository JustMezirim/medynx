import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { sendAppointmentReminderEmail } from "@/lib/email"
// import { filterProps } from "framer-motion"

export async function GET() {
  try {
    await connectDB()

    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Find appointments that need 24-hour reminders
    const dayReminders = await Appointment.find({
      status: "confirmed",
      paymentStatus: "paid",
      type: "video",
      date: {
        $gte: oneDayFromNow.toISOString().split('T')[0],
        $lt: new Date(oneDayFromNow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      dayReminderSent: { $ne: true }
    }).populate("patient doctor")

    // Find appointments that need 1-hour reminders
    const hourReminders = await Appointment.find({
      status: "confirmed",
      paymentStatus: "paid", 
      type: "video",
      date: {
        $gte: now.toISOString().split('T')[0],
        $lt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      hourReminderSent: { $ne: true }
    }).populate("patient doctor")

    // Send 24-hour reminders
    for (const appointment of dayReminders) {
      try {
        await sendAppointmentReminderEmail(
          appointment.patient.email,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          new Date(appointment.date).toLocaleDateString(),
          appointment.timeSlot,
          appointment.zoomJoinUrl,
          "24 hours"
        )

        await sendAppointmentReminderEmail(
          appointment.doctor.email,
          `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          new Date(appointment.date).toLocaleDateString(),
          appointment.timeSlot,
          appointment.zoomJoinUrl,
          "24 hours"
        )

        await Appointment.findByIdAndUpdate(appointment._id, { dayReminderSent: true })
      } catch (error) {
        console.error(`Failed to send 24-hour reminder for appointment ${appointment._id}:`, error)
      }
    }


    for (const appointment of hourReminders) {
      try {
        await sendAppointmentReminderEmail(
          appointment.patient.email,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          new Date(appointment.date).toLocaleDateString(),
          appointment.timeSlot,
          appointment.zoomJoinUrl,
          "1 hour"
        )

        await sendAppointmentReminderEmail(
          appointment.doctor.email,
          `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          new Date(appointment.date).toLocaleDateString(),
          appointment.timeSlot,
          appointment.zoomJoinUrl,
          "1 hour"
        )

        await Appointment.findByIdAndUpdate(appointment._id, { hourReminderSent: true })
      } catch (error) {
        console.error(`Failed to send 1-hour reminder for appointment ${appointment._id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      dayReminders: dayReminders.length,
      hourReminders: hourReminders.length
    })

  } catch (error) {
    console.error("Reminder cron job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

