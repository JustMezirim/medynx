import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import User from "@/lib/models/User"
import Appointment from "@/lib/models/Appointment"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
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

    const { id } = params
    
    const patient = await User.findById(id).select('-password')
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Get appointment statistics for this patient
    const appointments = await Appointment.find({ 
      patient: id,
      doctor: user.userId 
    })

    const appointmentsCount = appointments.length
    const lastAppointment = appointments.length > 0 
      ? appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null

    const patientData = {
      ...patient.toObject(),
      appointmentsCount,
      lastAppointment: lastAppointment?.date,
      lastStatus: lastAppointment?.status
    }

    return NextResponse.json({ patient: patientData })
  } catch (error) {
    console.error("Error fetching patient details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}