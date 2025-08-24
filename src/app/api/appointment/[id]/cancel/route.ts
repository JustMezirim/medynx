import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"
import { sendAppointmentCancellationEmail } from "@/lib/email"
import { triggerNotificationWebhook, NotificationEvents } from "@/lib/notifications"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Only admin can cancel appointments" }, { status: 403 })
    }

    const appointment = await Appointment.findById(params.id)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email")

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Update appointment status and payment status
    appointment.status = "cancelled"
    if (appointment.paymentStatus === "paid") {
      appointment.paymentStatus = "refunded"
    }
    await appointment.save()

    // Send refund notification email to patient
    if (appointment.paymentStatus === "refunded") {
      await sendAppointmentCancellationEmail(
        appointment.patient.email,
        `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        new Date(appointment.date).toLocaleDateString(),
        appointment.timeSlot,
        appointment.amount
      )
    }

    // Trigger notification webhook
    await triggerNotificationWebhook(NotificationEvents.APPOINTMENT_CANCELLED, {
      appointmentId: appointment._id.toString()
    })

    return NextResponse.json({ 
      message: "Appointment cancelled successfully",
      refunded: appointment.paymentStatus === "refunded"
    })
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}