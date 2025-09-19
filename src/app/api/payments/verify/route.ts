import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { sendAppointmentConfirmedPatientEmail, sendAppointmentBookedDoctorEmail, sendMeetingLinkPatientEmail, sendMeetingLinkDoctorEmail } from "@/lib/email"
import { webhooks } from "@/lib/webhooks"
// 


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")

    console.log("Payment verification - reference:", reference, "trxref:", trxref)

    const finalReference = reference || trxref
    if (!finalReference) {
      console.log("No reference found")
      return NextResponse.redirect(new URL("/dashboard/patient?error=invalid_reference", request.url))
    }

    // Check if payment was declined by checking Paystack API
    const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${finalReference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })
    
    const paystackData = await paystackResponse.json()
    
    if (!paystackData.status || paystackData.data.status !== 'success') {
      // Payment failed or was declined
      const appointment = await Appointment.findOne({ paymentId: finalReference })
      if (appointment) {
        appointment.paymentStatus = "failed"
        appointment.status = "payment_failed"
        await appointment.save()
      }
      return NextResponse.redirect(new URL("/dashboard/patient?error=payment_failed", request.url))
    }

    const appointment = await Appointment.findOne({ paymentId: finalReference })
      .populate("patient").populate("doctor")
    
    if (!appointment) {
      console.log("Appointment not found for reference:", finalReference)
      return NextResponse.redirect(new URL("/dashboard/patient?error=appointment_not_found", request.url))
    }

    // Admin will manually create Zoom meeting via button

    // Update appointment status from payment_pending to confirmed
    appointment.paymentStatus = "paid"
    appointment.status = "confirmed"
    
    // Trigger webhook for automatic Zoom meeting generation
    console.log('About to trigger payment success webhook for appointment:', appointment._id)
    try {
      const webhookUrl = process.env.PAYMENT_SUCCESS_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payment-success`
      console.log('Webhook URL:', webhookUrl)
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appointmentId: appointment._id.toString()
        })
      })
      
      console.log('Webhook response status:', response.status)
      const responseData = await response.json()
      console.log('Webhook response:', responseData)
      
      if (!response.ok) {
        console.error('Webhook failed with status:', response.status, responseData)
      }
    } catch (error) {
      console.error('Failed to trigger payment success webhook:', error)
    }
    
    await appointment.save()

    // Now trigger notifications since payment is successful
    webhooks.paymentSuccessful(appointment._id.toString())
    webhooks.appointmentConfirmed(appointment._id.toString())
    
    console.log("Found and updated appointment:", appointment?._id)



    // Send email notifications
    try {
      const appointmentDate = new Date(appointment.date).toLocaleDateString()
      console.log("Sending appointment confirmation emails...")
      
      // Send appointment confirmation emails
        await Promise.all([
          sendAppointmentConfirmedPatientEmail(
            appointment.patient.email,
            `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            appointmentDate,
            appointment.timeSlot,
            appointment.type
          ),
          sendAppointmentBookedDoctorEmail(
            appointment.doctor.email,
            `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            appointmentDate,
            appointment.timeSlot,
            appointment.type
          )
        ])
        console.log("Appointment confirmation emails sent")
        
        // Send meeting details if video consultation
        if (appointment.type === 'video' && appointment.zoomJoinUrl) {
          console.log('Sending meeting link emails...')
          try {
            await Promise.all([
              sendMeetingLinkPatientEmail(
                appointment.patient.email,
                `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment.zoomJoinUrl,
                appointment.zoomPassword || '',
                appointmentDate,
                appointment.timeSlot
              ),
              sendMeetingLinkDoctorEmail(
                appointment.doctor.email,
                `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
                `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment.zoomJoinUrl,
                appointment.zoomPassword || '',
                appointmentDate,
                appointment.timeSlot
              )
            ])
            console.log('Meeting link emails sent')
          } catch (meetingEmailError) {
            console.error("Failed to send meeting emails:", meetingEmailError)
          }
        }
    } catch (emailError) {
      console.error("Failed to send appointment emails:", emailError)
    }

    console.log("Appointment updated successfully")

    return NextResponse.redirect(new URL(`/dashboard/patient/appointments/${appointment._id}?success=payment_completed`, request.url))
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.redirect(new URL("/dashboard/patient?error=verification_failed", request.url))
  }
}