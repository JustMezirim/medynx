import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { event, data } = body

    if (event === "charge.success") {
      const reference = data.reference
      const appointmentId = reference.split('_')[1]

      // Update appointment payment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        status: "confirmed",
        paymentId: data.id
      })
    } else if (event === "charge.failed") {
      const reference = data.reference
      const appointmentId = reference.split('_')[1]

      // Mark appointment as payment failed
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "failed",
        status: "payment_failed"
      })
    }

    return NextResponse.json({ message: "Webhook processed" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Webhook failed" }, { status: 500 })
  }
}