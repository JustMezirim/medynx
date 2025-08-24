import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=error", request.url))
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.status && verifyData.data.status === "success") {
      const appointmentId = reference.split("_")[1]
      
      // Update appointment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        paymentId: verifyData.data.id,
        status: "confirmed"
      })

      return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=success", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=failed", request.url))
    }
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=error", request.url))
  }
}