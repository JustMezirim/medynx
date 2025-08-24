import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { sendAppointmentConfirmedPatientEmail, sendAppointmentBookedDoctorEmail, sendMeetingLinkPatientEmail, sendMeetingLinkDoctorEmail } from "@/lib/email"
import { triggerNotificationWebhook, NotificationEvents } from "@/lib/notifications"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")

    console.log("Payment verification - reference:", reference, "trxref:", trxref)

    const finalReference = reference || trxref
    if (!finalReference) {
      console.log("No reference found")
      return NextResponse.redirect(new URL("/dashboard/patient?error=invalid_reference", request.url))
    }

    const appointment = await Appointment.findOne({ paymentId: finalReference })
      .populate("patient").populate("doctor")
    
    if (!appointment) {
      console.log("Appointment not found for reference:", finalReference)
      return NextResponse.redirect(new URL("/dashboard/patient?error=appointment_not_found", request.url))
    }

    // Admin will manually create Zoom meeting via button

    // Update appointment status
    appointment.paymentStatus = "paid"
    appointment.status = "confirmed"
    await appointment.save()
    
    console.log("Found and updated appointment:", appointment?._id)

    // Trigger notification webhook
    await triggerNotificationWebhook(NotificationEvents.PAYMENT_SUCCESSFUL, {
      appointmentId: appointment._id.toString()
    })

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
        
        // Send meeting details if online
        if (appointment.type === 'online' && appointment.meetingLink) {
          console.log('Sending meeting link emails...')
          try {
            await Promise.all([
              sendMeetingLinkPatientEmail(
                appointment.patient.email,
                `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment.meetingLink,
                appointment.zoomPassword || '',
                appointmentDate,
                appointment.timeSlot
              ),
              sendMeetingLinkDoctorEmail(
                appointment.doctor.email,
                `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
                `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                appointment.meetingLink,
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