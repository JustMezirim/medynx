import { type NextRequest, NextResponse } from "next/server"
// import { verifyPayment } from "@/lib/paystack"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { createZoomMeeting } from "@/lib/zoom"
import { sendAppointmentConfirmedPatientEmail, sendAppointmentBookedDoctorEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const reference = body.data?.reference || body.reference

    console.log("Webhook received:", reference)

    if (!reference) {
      return NextResponse.json({ message: "No reference found" }, { status: 400 })
    }

    // Find and update appointment
    const appointment = await Appointment.findOneAndUpdate(
      { paymentId: reference },
      { 
        paymentStatus: "paid",
        status: "confirmed"
      },
      { new: true }
    ).populate("patient", "firstName lastName email")
     .populate("doctor", "firstName lastName email")

    if (!appointment) {
      console.log("Appointment not found for reference:", reference)
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    console.log("Appointment updated:", appointment._id)

    // Create Zoom meeting for video appointments
    if (appointment.type === "video") {
      try {
        const meetingTopic = `Medical Consultation - Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} & ${appointment.patient.firstName} ${appointment.patient.lastName}`
        const appointmentDateTime = new Date(appointment.date)
        const [hours, minutes] = appointment.timeSlot.split(':')
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))
        // const startTime = appointmentDateTime.toISOString()

        const zoomMeeting = await createZoomMeeting(meetingTopic, appointmentDateTime, appointment.timeSlot, 60)

        await Appointment.findByIdAndUpdate(appointment._id, {
          zoomMeetingId: zoomMeeting.id,
          zoomJoinUrl: zoomMeeting.join_url,
          zoomPassword: zoomMeeting.password
        })

        console.log("Zoom meeting created:", zoomMeeting.id)
      } catch (zoomError) {
        console.error("Failed to create Zoom meeting:", zoomError)
      }
    }


    // Send confirmation emails
    try {
      const appointmentDate = new Date(appointment.date).toLocaleDateString()
      const appointmentTime = appointment.timeSlot

      console.log("Sending confirmation emails for appointment:", appointment._id)

      // Send emails using centralized functions
      await Promise.all([
        sendAppointmentConfirmedPatientEmail(
          appointment.patient.email,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          appointmentDate,
          appointmentTime,
          appointment.type
        ),
        sendAppointmentBookedDoctorEmail(
          appointment.doctor.email,
          `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          appointmentDate,
          appointmentTime,
          appointment.type
        )
      ])

      console.log("Confirmation emails sent successfully")
    } catch (emailError) {
      console.error("Failed to send confirmation emails:", emailError)
    }

    return NextResponse.redirect(new URL(`/dashboard/patient/appointments/${appointment._id}?success=payment_completed`, `${process.env.NEXT_PUBLIC_BASE_URL}`))
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
