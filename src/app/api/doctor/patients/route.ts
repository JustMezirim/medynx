import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"

import Appointment from "@/lib/models/Appointment"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user || user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get all appointments for this doctor to find their patients
    const appointments = await Appointment.find({ doctor: user.userId })
      .populate('patient', 'firstName lastName email phone dateOfBirth gender address')
      .sort({ date: -1 })

    // Group appointments by patient and get statistics
    const patientMap = new Map()
    
    appointments.forEach(appointment => {
      if (appointment.patient) {
        const patientId = appointment.patient._id.toString()
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            ...appointment.patient.toObject(),
            appointmentsCount: 0,
            lastAppointment: null,
            lastStatus: null
          })
        }
        
        const patientData = patientMap.get(patientId)
        patientData.appointmentsCount++
        
        if (!patientData.lastAppointment || new Date(appointment.date) > new Date(patientData.lastAppointment)) {
          patientData.lastAppointment = appointment.date
          patientData.lastStatus = appointment.status
        }
      }
    })

    const patients = Array.from(patientMap.values())

    return NextResponse.json({
      patients,
      total: patients.length,
    })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}