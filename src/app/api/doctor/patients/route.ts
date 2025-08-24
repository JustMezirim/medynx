import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Appointment from "@/lib/models/Appointment"
import User from "@/lib/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyToken(token)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctor: payload.userId })
      .populate("patient", "firstName lastName email phone dateOfBirth gender")
      .sort({ date: -1 })
      .lean()

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ patients: [] })
    }

    // Group by patient and get unique patients with their latest appointment
    const patientsMap = new Map()

    appointments.forEach((appointment) => {
      if (!appointment.patient) return // Skip if patient not populated
      
      const patientId = appointment.patient._id.toString()
      if (!patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          _id: appointment.patient._id,
          firstName: appointment.patient.firstName || '',
          lastName: appointment.patient.lastName || '',
          email: appointment.patient.email || '',
          phone: appointment.patient.phone || '',
          dateOfBirth: appointment.patient.dateOfBirth || new Date(),
          gender: appointment.patient.gender || 'Not specified',
          lastAppointment: appointment.date,
          appointmentsCount: 1,
          lastStatus: appointment.status,
        })
      } else {
        const existing = patientsMap.get(patientId)
        existing.appointmentsCount += 1
        if (new Date(appointment.date) > new Date(existing.lastAppointment)) {
          existing.lastAppointment = appointment.date
          existing.lastStatus = appointment.status
        }
      }
    })

    const patients = Array.from(patientsMap.values())

    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Error fetching doctor patients: ', error)
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
