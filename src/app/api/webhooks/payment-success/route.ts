import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import { createZoomMeeting } from "@/lib/zoom"
import { sendMeetingLinkPatientEmail, sendMeetingLinkDoctorEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { appointmentId } = await request.json()
    
    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID required" }, { status: 400 })
    }

    console.log('Processing payment success webhook for appointment:', appointmentId)

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email")

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Only process video appointments that don't already have a Zoom link
    if (appointment.type === "video" && !appointment.zoomJoinUrl) {
      console.log('Creating Zoom meeting for video appointment')
      
      try {
        const appointmentDateTime = new Date(appointment.date)
        // const meetingTime = appointmentDateTime.toISOString()
        
        const meetingData = await createZoomMeeting(
          `Medical Consultation - Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
          appointmentDateTime,
          appointment.timeSlot,
          60
        )
        
        appointment.zoomMeetingId = meetingData.id
        appointment.zoomJoinUrl = meetingData.join_url
        appointment.zoomPassword = meetingData.password
        await appointment.save()
        
        console.log('Zoom meeting created:', meetingData.id)

        const appointmentDate = appointmentDateTime.toLocaleDateString()
        
        await Promise.all([
          sendMeetingLinkPatientEmail(
            appointment.patient.email,
            `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            appointment.zoomJoinUrl,
            appointment.zoomPassword,
            appointmentDate,
            appointment.timeSlot
          ),
          sendMeetingLinkDoctorEmail(
            appointment.doctor.email,
            `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            appointment.zoomJoinUrl,
            appointment.zoomPassword,
            appointmentDate,
            appointment.timeSlot
          )
        ])
        
        console.log('Meeting link emails sent successfully')
        
      } catch (error) {
        console.error('Failed to create Zoom meeting or send emails:', error)
        return NextResponse.json({ error: "Failed to process meeting creation" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("Payment success webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}