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
      
      console.log('Payment successful for appointment:', appointmentId)
      
      // Update appointment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        paymentId: verifyData.data.id,
        status: "confirmed"
      })

      // Trigger webhook for Zoom meeting generation
      console.log('Triggering payment success webhook')
      try {
        const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/payment-success`
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            appointmentId: appointmentId
          })
        })
        
        console.log('Webhook response status:', response.status)
        if (!response.ok) {
          console.error('Webhook failed')
        }
      } catch (error) {
        console.error('Failed to trigger webhook:', error)
      }

      return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=success", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=failed", request.url))
    }
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/patient/appointments?status=error", request.url))
  }
}