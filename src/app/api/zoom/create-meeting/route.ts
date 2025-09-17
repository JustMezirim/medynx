import { type NextRequest, NextResponse } from "next/server"
import { createZoomMeeting } from "@/lib/zoom"
import { verifyToken } from "@/lib/auth"
import { sendMeetingLinkPatientEmail, sendMeetingLinkDoctorEmail } from "@/lib/email"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (payload.role !== "admin") {
      return NextResponse.json({ message: "Only admin can create meetings" }, { status: 403 })
    }

    const { appointmentId } = await request.json()

    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email")

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Create Zoom meeting
    const meetingTopic = `Medical Consultation - Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} & ${appointment.patient.firstName} ${appointment.patient.lastName}`
    const appointmentDate = new Date(appointment.date)
    const appointmentDateTime = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), 10, 0, 0)

    const zoomMeeting = await createZoomMeeting(meetingTopic, appointmentDateTime, appointment.timeSlot, 60)

    // Update appointment with Zoom details
    appointment.meetingLink = zoomMeeting.join_url
    appointment.zoomMeetingId = zoomMeeting.id
    appointment.zoomPassword = zoomMeeting.password
    await appointment.save()

    // Send emails to both patient and doctor
    const formattedDate = appointmentDate.toLocaleDateString()
    
    await Promise.all([
      sendMeetingLinkPatientEmail(
        appointment.patient.email,
        `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        zoomMeeting.join_url,
        zoomMeeting.password,
        formattedDate,
        appointment.timeSlot
      ),
      sendMeetingLinkDoctorEmail(
        appointment.doctor.email,
        `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        zoomMeeting.join_url,
        zoomMeeting.password,
        formattedDate,
        appointment.timeSlot
      )
    ])

    return NextResponse.json({
      message: "Zoom meeting created and emails sent successfully",
      meeting: {
        id: zoomMeeting.id,
        joinUrl: zoomMeeting.join_url,
        password: zoomMeeting.password,
      },
    })
  } catch (error) {
    console.error("Error creating Zoom meeting:", error)
    return NextResponse.json({ message: "Failed to create Zoom meeting" }, { status: 500 })
  }
}
