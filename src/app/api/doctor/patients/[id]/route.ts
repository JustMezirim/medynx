import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import Appointment from "@/lib/models/Appointment"
import { verifyToken } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyToken(token)
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }
    
    if (payload.role !== "doctor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id: patientId } = await params

    // Verify this patient has appointments with this doctor
    const hasAppointment = await Appointment.findOne({
      doctor: payload.userId,
      patient: patientId
    })

    if (!hasAppointment) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    // Get patient details
    const patient = await User.findById(patientId)
      .select("firstName lastName email phone dateOfBirth gender address")
      .lean()

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 })
    }

    return NextResponse.json({ patient })
  } catch (error) {
    console.error("Error fetching patient details:", error)
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}